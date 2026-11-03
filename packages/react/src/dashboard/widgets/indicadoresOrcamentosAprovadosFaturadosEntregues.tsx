import { z } from 'zod'
import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { useEffect, useRef, useState } from 'react'
import { FileText, CheckCircle2, Receipt, PackageCheck } from 'lucide-react'
import { zodStringToJson } from '../../utils'
import { Estrutura } from '../estrutura'
import { milhares } from '../../formatacoes'
import { useDashboard } from '../context'

const paletas = {
    azul: { cardFundo: '#EFF6FF', badgeFundo: '#DBEAFE', texto: '#1E40AF', forte: '#2563EB' },
    roxo: { cardFundo: '#F5F3FF', badgeFundo: '#E9E5FF', texto: '#5B21B6', forte: '#7C3AED' },
    laranja: { cardFundo: '#FFF7ED', badgeFundo: '#FFEAD5', texto: '#9A3412', forte: '#EA580C' },
    verde: { cardFundo: '#F1FAF4', badgeFundo: '#D7F0DF', texto: '#166534', forte: '#16A34A' },
} as const

const etapas = [
    { campo: 'ValorOrcamentos', rotulo: 'Orçamentos', cor: paletas.azul, Icone: FileText },
    { campo: 'ValorAprovados', rotulo: 'Aprovados', cor: paletas.roxo, Icone: CheckCircle2 },
    { campo: 'ValorFaturados', rotulo: 'Faturados', cor: paletas.laranja, Icone: Receipt },
    { campo: 'ValorEntregues', rotulo: 'Entregues', cor: paletas.verde, Icone: PackageCheck },
] as const

export function IndicadoresOrcamentosAprovadosFaturadosEntregues(w: AgulhaoDashboardWidget) {
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
        <Estrutura
            id={w.id}
            titulo={w.titulo}
            descricao={w.descricao}
            ultimaSincronizacao={w.ultimaSincronizacao}
            carregando={carregando}
            periodo={dados?.periodo}>
            <div style={{ padding: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                    {etapas.map((e) => (
                        <div
                            key={e.campo}
                            style={{
                                background: e.cor.cardFundo,
                                border: `1px solid ${e.cor.badgeFundo}`,
                                borderRadius: '14px',
                                padding: '0.8rem 1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        minWidth: '30px',
                                        borderRadius: '50%',
                                        background: e.cor.badgeFundo,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: e.cor.forte,
                                    }}>
                                    <e.Icone size={16} />
                                </div>
                                <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: e.cor.texto }}>{e.rotulo}</p>
                            </div>
                            <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: e.cor.forte }}>R$ {milhares(dados?.[e.campo] || 0)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Estrutura>
    )
}

export const IndicadoresOrcamentosAprovadosFaturadosEntreguesLayout: LayoutItem = {
    i: 'indicadoresOrcamentosAprovadosFaturadosEntregues',
    x: 0,
    y: 0,
    w: 4,
    h: 2,
    isResizable: false,
    isDraggable: true,
}

const schema = z.object({
    ValorOrcamentos: z.coerce.number(),
    ValorAprovados: z.coerce.number(),
    ValorFaturados: z.coerce.number(),
    ValorEntregues: z.coerce.number(),
    periodo: z.string().optional(),
})

type Dados = z.infer<typeof schema>
