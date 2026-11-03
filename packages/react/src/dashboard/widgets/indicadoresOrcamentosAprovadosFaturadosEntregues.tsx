import { z } from 'zod'
import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { useEffect, useRef, useState } from 'react'
import { zodStringToJson } from '../../utils'
import { Estrutura } from '../estrutura'
import { milhares } from '../../formatacoes'
import { useDashboard } from '../context'

const etapas = [
    { campo: 'ValorOrcamentos', rotulo: 'Orçamentos' },
    { campo: 'ValorAprovados', rotulo: 'Aprovados' },
    { campo: 'ValorFaturados', rotulo: 'Faturados' },
    { campo: 'ValorEntregues', rotulo: 'Entregues' },
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

    const valores = etapas.map((e) => dados?.[e.campo] || 0)
    const base = valores[0]

    return (
        <Estrutura id={w.id} titulo={w.titulo} descricao={w.descricao} ultimaSincronizacao={w.ultimaSincronizacao} carregando={carregando}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px', padding: '1rem' }}>
                {etapas.map((e, i) => {
                    const valor = valores[i]
                    const percentualAnterior = i === 0 ? null : valores[i - 1] ? (valor / valores[i - 1]) * 100 : 0
                    const percentualBase = base ? (valor / base) * 100 : 0

                    return (
                        <div key={e.campo}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#646464' }}>{e.rotulo}</p>
                            <p style={{ margin: '2px 0', fontSize: '1.25rem', fontWeight: 'bold' }}>R$ {milhares(valor)}</p>
                            <p style={{ margin: '0 0 6px', fontSize: '0.75rem', color: '#646464' }}>
                                {percentualAnterior === null ? 'base' : `${milhares(percentualAnterior)}% do anterior`}
                            </p>
                            <div style={{ height: '6px', borderRadius: '4px', background: 'var(--ag-dashboard-cor)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${Math.min(percentualBase, 100)}%`, background: '#235DD9' }} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </Estrutura>
    )
}

export const IndicadoresOrcamentosAprovadosFaturadosEntreguesLayout: LayoutItem = {
    i: 'indicadoresOrcamentosAprovadosFaturadosEntregues',
    x: 0,
    y: 0,
    w: 6,
    h: 2,
    minW: 2,
    minH: 2,
    isResizable: true,
    isDraggable: true,
}

const schema = z.object({
    ValorOrcamentos: z.coerce.number(),
    ValorAprovados: z.coerce.number(),
    ValorFaturados: z.coerce.number(),
    ValorEntregues: z.coerce.number(),
})

type Dados = z.infer<typeof schema>
