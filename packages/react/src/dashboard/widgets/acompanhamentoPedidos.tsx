import { z } from 'zod'
import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { useEffect, useRef, useState } from 'react'
import { statusPedidoAgulhao, zodStringToJson } from '../../utils'
import { AgulhaoChart } from '../../chart'
import { Estrutura } from '../estrutura'
import { inteiro, milhares } from '../../formatacoes'
import { useDashboard } from '../context'

export function AcompanhamentoPedidos(w: AgulhaoDashboardWidget) {
    const { atualizaWidget } = useDashboard()

    const [carregando, setCarregando] = useState(false)
    const [dados, setDados] = useState<Dados | null>(zodStringToJson(w.conteudo || '{}', schema).data || null)
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
            const dadosAtualizados = zodStringToJson(resultado, schema).data || null
            setDados(dadosAtualizados)
        }
    }

    return (
        <Estrutura id={w.id} titulo={w.titulo} descricao={w.descricao} ultimaSincronizacao={w.ultimaSincronizacao} carregando={carregando}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <AgulhaoChart
                    style={{ flexGrow: 1 }}
                    grafico={{
                        tipo: 'pizza',
                        dataset: {
                            linhas: (dados?.lista || []).map((l) => {
                                const status = statusPedidoAgulhao.find((s) => s.sigla === l.status)
                                return { status: status?.descricao || l.status, quantidade: l.quantidade, cor: status?.cor || '' }
                            }),
                        },
                        mapeamento: { rotulo: 'status', valor: 'quantidade', cor: 'cor' },
                        opcoes: {
                            serie: { nome: 'Status do pedido' },
                            pizza: { raio: '50%' },
                            rotulo: {
                                formato: (p) => `${p.name}\n ${inteiro(p.value)} (${milhares(p.percent)}%)`,
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
                    {renderizaValor('Peças', inteiro(dados?.pecas || 0))}
                    {renderizaValor('Pedidos', inteiro(dados?.registros || 0))}
                    {renderizaValor('Bruto', `R$ ${milhares(dados?.bruto || 0)}`)}
                    {renderizaValor('Descontos (-)', `R$ ${milhares(dados?.descontos || 0)}`)}
                    {renderizaValor('Outros (+)', `R$ ${milhares(dados?.outros || 0)}`)}
                    {renderizaValor('Líquido', `R$ ${milhares(dados?.liquido || 0)}`)}
                </div>
            </div>
        </Estrutura>
    )
}

function renderizaValor(descricao: string, valor: string) {
    return (
        <div>
            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.875rem' }}>{descricao}</p>
            <p style={{ margin: 0, marginTop: '2px', color: descricao === 'Líquido' ? '#00a91f' : '' }}>{valor}</p>
        </div>
    )
}

export const AcompanhamentoPedidosLayout: LayoutItem = {
    i: 'acompanhamentoPedidos',
    x: 0,
    y: 0,
    w: 4,
    h: 4,
    minW: 1,
    minH: 1,
    isResizable: true,
    isDraggable: true,
}

const schema = z.object({
    pecasFaturadas: z.number(),
    pecas: z.number(),
    registros: z.number(),
    bruto: z.number(),
    outros: z.number(),
    liquido: z.number(),
    descontos: z.number(),
    lista: z
        .array(
            z.object({
                status: z.string(),
                quantidade: z.number(),
                valor: z.number(),
            }),
        )
        .optional(),
})

type Dados = z.infer<typeof schema>
