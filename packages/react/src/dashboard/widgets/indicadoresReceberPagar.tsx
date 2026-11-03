import { z } from 'zod'
import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { zodStringToJson } from '../../utils'
import { Estrutura } from '../estrutura'
import { milhares } from '../../formatacoes'
import { useDashboard } from '../context'

const paletas = {
    verde: { cardFundo: '#F1FAF4', badgeFundo: '#D7F0DF', texto: '#166534', forte: '#16A34A' },
    vermelho: { cardFundo: '#FDF2F2', badgeFundo: '#FBD9D7', texto: '#991B1B', forte: '#DC2626' },
} as const

const grupos = [
    {
        rotulo: 'A Receber',
        cor: paletas.verde,
        Icone: ArrowDown,
        campoTotal: ['receber_vencidas', 'receber_Hoje', 'receber_aVencer'] as const,
        hoje: { campo: 'receber_Hoje', rotulo: 'Hoje' } as const,
        secundarios: [
            { campo: 'receber_vencidas', rotulo: 'Vencidas', alerta: true },
            { campo: 'receber_aVencer', rotulo: 'A vencer', alerta: false },
        ] as const,
    },
    {
        rotulo: 'A Pagar',
        cor: paletas.vermelho,
        Icone: ArrowUp,
        campoTotal: ['pagar_vencidas', 'pagar_Hoje', 'pagar_proximos30dias'] as const,
        hoje: { campo: 'pagar_Hoje', rotulo: 'Hoje' } as const,
        secundarios: [
            { campo: 'pagar_vencidas', rotulo: 'Vencidas', alerta: true },
            { campo: 'pagar_proximos30dias', rotulo: 'Próximos 30 dias', alerta: false },
        ] as const,
    },
] as const

export function IndicadoresReceberPagar(w: AgulhaoDashboardWidget) {
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
            <div style={{ display: 'flex', gap: '12px', padding: '1rem', height: '100%' }}>
                {grupos.map((grupo) => {
                    const total = grupo.campoTotal.reduce((soma, c) => soma + (dados?.[c] || 0), 0)
                    const hoje = dados?.[grupo.hoje.campo] || 0

                    return (
                        <div
                            key={grupo.rotulo}
                            style={{
                                flex: 1,
                                background: grupo.cor.cardFundo,
                                border: `1px solid ${grupo.cor.badgeFundo}`,
                                borderRadius: '14px',
                                padding: '0.9rem 1rem',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        minWidth: '30px',
                                        borderRadius: '50%',
                                        background: grupo.cor.badgeFundo,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: grupo.cor.forte,
                                    }}>
                                    <grupo.Icone size={16} />
                                </div>
                                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: grupo.cor.texto }}>{grupo.rotulo}</p>
                            </div>

                            <p style={{ margin: '8px 0 10px', fontSize: '1.6rem', fontWeight: 700, color: grupo.cor.forte, lineHeight: 1.1 }}>
                                R$ {milhares(total)}
                            </p>

                            <div
                                style={{
                                    background: grupo.cor.badgeFundo,
                                    borderRadius: '10px',
                                    padding: '8px 10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: grupo.cor.texto }}>{grupo.hoje.rotulo}</span>
                                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: grupo.cor.forte }}>R$ {milhares(hoje)}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                {grupo.secundarios.map((s) => {
                                    const valor = dados?.[s.campo] || 0
                                    const emAlerta = s.alerta && valor > 0

                                    return (
                                        <div key={s.campo} style={{ flex: 1 }}>
                                            <p
                                                style={{
                                                    margin: 0,
                                                    fontSize: '0.68rem',
                                                    fontWeight: s.alerta ? 700 : 400,
                                                    color: s.alerta ? '#DC2626' : '#8a8a8a',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}>
                                                {s.alerta && (
                                                    <span
                                                        className={emAlerta ? 'ag-dashboard-pulso' : undefined}
                                                        style={{ width: '6px', height: '6px', minWidth: '6px', borderRadius: '50%', background: '#DC2626' }}
                                                    />
                                                )}
                                                {s.rotulo}
                                            </p>
                                            <p
                                                style={{
                                                    margin: '2px 0 0',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 700,
                                                    color: s.alerta ? '#DC2626' : grupo.cor.texto,
                                                }}>
                                                R$ {milhares(valor)}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </Estrutura>
    )
}

export const IndicadoresReceberPagarLayout: LayoutItem = {
    i: 'indicadoresReceberPagar',
    x: 0,
    y: 0,
    w: 4,
    h: 2,
    minW: 3,
    minH: 3,
    isResizable: false,
    isDraggable: true,
}

const schema = z.object({
    receber_vencidas: z.coerce.number(),
    receber_Hoje: z.coerce.number(),
    receber_aVencer: z.coerce.number(),
    pagar_vencidas: z.coerce.number(),
    pagar_Hoje: z.coerce.number(),
    pagar_proximos30dias: z.coerce.number(),
})

type Dados = z.infer<typeof schema>
