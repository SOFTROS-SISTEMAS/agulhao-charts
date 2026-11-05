import { z } from 'zod'
import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { useEffect, useRef, useState } from 'react'
import { Wallet } from 'lucide-react'
import { zodStringToJson } from '../../utils'
import { Estrutura } from '../estrutura'
import { milhares } from '../../formatacoes'
import { useDashboard } from '../context'
import { bancos } from '../../bancos'

const paletas = {
    verde: { cardFundo: '#F1FAF4', badgeFundo: '#D7F0DF', texto: '#166534', forte: '#16A34A' },
    vermelho: { cardFundo: '#FDF2F2', badgeFundo: '#FBD9D7', texto: '#991B1B', forte: '#DC2626' },
} as const

export function IndicadoresSaldoContas(w: AgulhaoDashboardWidget) {
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

    const lista = dados || []
    const total = lista.reduce((soma, conta) => soma + conta.saldo, 0)
    const corTotal = total < 0 ? paletas.vermelho : paletas.verde

    return (
        <Estrutura id={w.id} titulo={w.titulo} descricao={w.descricao} ultimaSincronizacao={w.ultimaSincronizacao} carregando={carregando}>
            <div
                style={{
                    margin: '1rem 1rem 0',
                    background: corTotal.forte,
                    borderRadius: '12px',
                    padding: '0.7rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>Total somado das contas</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white' }}>R$ {milhares(total)}</span>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '14px',
                    padding: '1rem',
                }}>
                {lista.map((conta) => {
                    const cor = conta.saldo < 0 ? paletas.vermelho : paletas.verde
                    const banco = conta.bancoCod ? bancos.get(conta.bancoCod) : undefined

                    return (
                        <div
                            key={conta.id}
                            style={{
                                // background: cor.cardFundo,
                                border: `1px solid #ececec`,
                                borderLeft: banco ? `4px solid ${banco.cor}` : `1px solid #ececec`,
                                borderRadius: '16px',
                                padding: '1.1rem 1.3rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        minWidth: '44px',
                                        borderRadius: '50%',
                                        background: banco ? `${banco.cor}1A` : cor.badgeFundo,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: banco ? banco.cor : cor.forte,
                                        overflow: 'hidden',
                                    }}>
                                    {banco?.iconeUrl ? (
                                        <img src={banco.iconeUrl} alt={banco.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <Wallet size={22} />
                                    )}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            fontSize: '0.88rem',
                                            fontWeight: 600,
                                            color: cor.texto,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                        title={conta.conta}>
                                        {conta.conta}
                                    </p>
                                    {banco && (
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: '0.75rem',
                                                color: '#8a8a8a',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                            title={banco.nome}>
                                            {banco.nome}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <p style={{ margin: 0, fontSize: '1.6rem', fontWeight: 700, color: cor.forte, overflowWrap: 'anywhere' }}>
                                R$ {milhares(conta.saldo)}
                            </p>
                        </div>
                    )
                })}
            </div>
        </Estrutura>
    )
}

export const IndicadoresSaldoContasLayout: LayoutItem = {
    i: 'indicadoresSaldoContas',
    x: 0,
    y: 0,
    w: 6,
    h: 4,
    minW: 4,
    minH: 3,
    isResizable: true,
    isDraggable: true,
}

const schema = z
    .array(
        z.object({
            id: z.string(),
            conta: z.string(),
            saldo: z.coerce.number(),
            bancoCod: z.string().nullish(),
        }),
    )
    .optional()

type Dados = z.infer<typeof schema>
