import { z } from 'zod'
import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { useEffect, useRef, useState } from 'react'
import { zodStringToJson } from '../../utils'
import { AgulhaoChart } from '../../chart'
import { Estrutura } from '../estrutura'
import { milhares } from '../../formatacoes'
import { useDashboard } from '../context'

const nomesMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export function GraficoReceitasMesPlanoContas(w: AgulhaoDashboardWidget) {
    const { atualizaWidget } = useDashboard()

    const [carregando, setCarregando] = useState(false)
    const [dados, setDados] = useState<Dados>(zodStringToJson(w.conteudo || '[]', schema).data || [])
    const intervalo = useRef<number | null>(null)

    useEffect(() => {
        if (w.atualizaEmSegundos && w.atualizaEmSegundos > 0) {
            intervalo.current = window.setInterval(() => {
                atualizar()
            }, w.atualizaEmSegundos * 1000)
        }

        return () => {
            if (intervalo.current) {
                clearInterval(intervalo.current)
            }
        }
    }, [])

    const atualizar = async () => {
        setCarregando(true)
        const resultado = await atualizaWidget(w.widgetId, w.id)
        setCarregando(false)

        if (resultado) {
            const dadosAtualizados = zodStringToJson(resultado, schema).data || []
            setDados(dadosAtualizados)
        }
    }

    const mesVigente = dados.reduce((maior, d) => Math.max(maior, d.ano * 100 + d.mes), 0)
    const doMesVigente = dados.filter((d) => d.ano * 100 + d.mes === mesVigente)

    const porPlanoContas = new Map<string, number>()
    for (const d of doMesVigente) {
        porPlanoContas.set(d.planoContas, (porPlanoContas.get(d.planoContas) || 0) + d.valor)
    }
    const linhas = [...porPlanoContas.entries()].sort((a, b) => b[1] - a[1]).map(([planoContas, valor]) => ({ planoContas, valor }))

    const total = linhas.reduce((soma, l) => soma + l.valor, 0)

    return (
        <Estrutura id={w.id} titulo={w.titulo} descricao={w.descricao} ultimaSincronizacao={w.ultimaSincronizacao} carregando={carregando}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <AgulhaoChart
                    style={{ flexGrow: 1 }}
                    grafico={{
                        tipo: 'pizza',
                        dataset: { linhas },
                        mapeamento: { rotulo: 'planoContas', valor: 'valor' },
                        opcoes: {
                            pizza: {
                                raio: '50%',
                            },
                            legenda: {
                                orientacao: 'horizontal',
                            },
                            formatadorValor: (v) => milhares(v, 'R$'),
                            rotulo: {
                                formato: (p) => `${p.name}\n ${milhares(p.value, 'R$')} (${milhares(p.percent)}%)`,
                                tamanhoFonte: 18,
                                alturaLinha: 20,
                                espacamento: 10,
                                linha: { comprimento: 40, comprimento2: 40, suave: false },
                            },
                        },
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--ag-dashboard-cor)',
                        textAlign: 'center',
                        padding: '10px',
                    }}>
                    {renderizaValor('Mês', mesVigente ? `${nomesMes[(mesVigente % 100) - 1]}/${Math.floor(mesVigente / 100)}` : '-')}
                    {renderizaValor('Total', `R$ ${milhares(total)}`)}
                </div>
            </div>
        </Estrutura>
    )
}

function renderizaValor(descricao: string, valor: string) {
    return (
        <div>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.875rem' }}>{descricao}</p>
            <p style={{ margin: 0, marginTop: '2px' }}>{valor}</p>
        </div>
    )
}

export const GraficoReceitasMesPlanoContasLayout: LayoutItem = {
    i: 'graficoReceitasMesPlanoContas',
    x: 0,
    y: 0,
    w: 4,
    h: 4,
    minW: 1,
    minH: 1,
    isResizable: true,
    isDraggable: true,
}

const linhaSchema = z.object({
    mes: z.coerce.number(),
    ano: z.coerce.number(),
    planoContas: z.string(),
    valor: z.coerce.number(),
})

const schema = z.array(linhaSchema)

type Dados = z.infer<typeof schema>
