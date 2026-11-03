import { z } from 'zod'
import { DefinicaoGrafico } from '@softros/agulhao-charts-core'
import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { useEffect, useRef, useState } from 'react'
import { zodStringToJson } from '../../utils'
import { AgulhaoChart } from '../../chart'
import { Estrutura } from '../estrutura'
import { milhares } from '../../formatacoes'
import { useDashboard } from '../context'

const nomesMes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function GraficoVendasUltimos12Meses(w: AgulhaoDashboardWidget) {
    const { atualizaWidget } = useDashboard()

    const [carregando, setCarregando] = useState(false)
    const [dados, setDados] = useState<Dados>(zodStringToJson(w.conteudo || '[]', schema).data || [])
    const [grafico, setGrafico] = useState<DefinicaoGrafico | null>(null)
    const [{ totalAtual, totalAnterior, variacao }, setTotais] = useState({ totalAtual: 0, totalAnterior: 0, variacao: null as number | null })
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

    useEffect(() => {
        setTimeout(() => {
            const meses = [...dados].sort((a, b) => a.anoAtual * 100 + a.mes - (b.anoAtual * 100 + b.mes))

            const totalAtual = meses.reduce((soma, m) => soma + m.valorAtual, 0)
            const totalAnterior = meses.reduce((soma, m) => soma + m.valorAnterior, 0)
            const variacao = totalAnterior ? ((totalAtual - totalAnterior) / totalAnterior) * 100 : null

            setTotais({ totalAtual, totalAnterior, variacao })
            setGrafico({
                tipo: 'barra',
                dataset: {
                    colunas: [
                        { nome: 'atual', tipo: 'numero', rotulo: 'Ano atual' },
                        { nome: 'anterior', tipo: 'numero', rotulo: 'Ano anterior' },
                    ],
                    linhas: meses.map((m) => ({
                        mesAno: `${nomesMes[m.mes - 1]}/${String(m.anoAtual).slice(-2)}`,
                        atual: m.valorAtual,
                        anterior: m.valorAnterior,
                    })),
                },
                mapeamento: { eixoX: 'mesAno', eixoY: ['atual', 'anterior'] },
                opcoes: {
                    mostrarLegenda: true,
                    formatadorValor: (valor) => milhares(valor, 'R$'),
                    eixoValor: {
                        tamanhoFonte: 16,
                    },
                    serie: {
                        cor: [
                            { nome: 'Ano atual', cor: '#235DD9' },
                            { nome: 'Ano anterior', cor: '#B9C2D0' },
                        ],
                    },
                },
            })
        }, 0)
    }, [dados])

    const atualizar = async () => {
        setCarregando(true)
        const resultado = await atualizaWidget(w.widgetId, w.id)
        setCarregando(false)

        if (resultado) {
            const dadosAtualizados = zodStringToJson(resultado, schema).data || []
            setDados(dadosAtualizados)
        }
    }

    return (
        <Estrutura id={w.id} titulo={w.titulo} descricao={w.descricao} ultimaSincronizacao={w.ultimaSincronizacao} carregando={carregando}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {grafico && <AgulhaoChart style={{ flexGrow: 1 }} grafico={grafico} />}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--ag-dashboard-cor)',
                        textAlign: 'center',
                        padding: '10px',
                    }}>
                    {renderizaValor('Ano atual', `R$ ${milhares(totalAtual)}`)}
                    {renderizaValor('Ano anterior', `R$ ${milhares(totalAnterior)}`)}
                    {renderizaValor(
                        'Variação',
                        variacao === null ? '-' : `${variacao >= 0 ? '+' : ''}${milhares(variacao)}%`,
                        variacao === null ? undefined : variacao >= 0 ? '#00a91f' : '#db4444',
                    )}
                </div>
            </div>
        </Estrutura>
    )
}

function renderizaValor(descricao: string, valor: string, cor?: string) {
    return (
        <div>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.875rem' }}>{descricao}</p>
            <p style={{ margin: 0, marginTop: '2px', color: cor || '' }}>{valor}</p>
        </div>
    )
}

export const GraficoVendasUltimos12MesesLayout: LayoutItem = {
    i: 'graficoVendasUltimos12meses',
    x: 0,
    y: 0,
    w: 6,
    h: 4,
    minW: 4,
    minH: 4,
    isResizable: true,
    isDraggable: true,
}

const linhaSchema = z.object({
    mes: z.coerce.number(),
    anoAtual: z.coerce.number(),
    anoAnterior: z.coerce.number(),
    valorAtual: z.coerce.number(),
    valorAnterior: z.coerce.number().optional().default(0),
})

const schema = z.array(linhaSchema)

type Dados = z.infer<typeof schema>
