import { ForwardedRef, useImperativeHandle, useRef } from 'react'
import { Responsive, useContainerWidth } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from './types'
import { dashboardWidgets } from './widgets'
import { DashboardContext } from './context'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './dashboard.css'

type LayoutItem = { i: string; x: number; y: number; w: number; h: number }
type ElementoRenderizado = { id: string; elemento: Element; y: number }

interface AgulhaoDashboardProps {
    id?: string
    widgets: AgulhaoDashboardWidget[]
    alterouLayout?: (layout: LayoutItem[]) => void
    solicitouAtualizacao?: (widgetId: string, id: string) => Promise<string | null>
    ref?: ForwardedRef<AgulhaoDashboardRef>
}

export interface AgulhaoDashboardRef {
    /**
     * @returns Retorna o layout atual do dashboard, incluindo a posição e tamanho de cada widget.
     */
    retornarLayout: () => LayoutItem[]
    /**
     * @returns Retorna os elementos renderizados no dashboard, incluindo o id, o elemento HTML e a posição vertical (y) de cada widget.
     */
    retornarElementos: () => ElementoRenderizado[]
}

export function AgulhaoDashboard({
    id = 'agulhao-dashboard',
    widgets,
    alterouLayout,
    ref,
    solicitouAtualizacao = () => Promise.resolve(null),
}: AgulhaoDashboardProps) {
    const { width, containerRef } = useContainerWidth({ debounceTimeout: 100 })
    const posicoesAtualizadas = useRef<LayoutItem[]>([])

    useImperativeHandle(ref, () => ({
        retornarLayout,
        retornarElementos,
    }))

    const retornarElementos = () => {
        const elementosHtml = Array.from(document.getElementsByClassName('react-grid-item'))
        const elementos: Map<string, ElementoRenderizado> = new Map()

        elementosHtml.forEach((el, i) => {
            const id = el.firstElementChild?.id || `sem-id-${i}`
            const y = Number((el.getAttribute('style') || '').replace(/(.*\, )|\D/g, '')) || 0

            elementos.set(id, { id, elemento: el, y })
        })

        const retorno = Array.from(elementos.values()).sort((a, b) => a.y - b.y)

        return retorno
    }

    const retornarLayout = () => {
        return posicoesAtualizadas.current
    }

    const salvarLayout = (layout: LayoutItem[]) => {
        posicoesAtualizadas.current = layout
        alterouLayout?.(layout)
    }

    return (
        <DashboardContext.Provider
            value={{
                atualizaWidget: solicitouAtualizacao,
            }}>
            <div id={id} style={{ flex: 1, height: '100%', overflowY: 'auto' }}>
                <Responsive
                    innerRef={containerRef}
                    width={width}
                    onLayoutChange={(l) => salvarLayout(l.map((item) => ({ i: item.i, x: item.x, y: item.y, w: item.w, h: item.h })))}
                    dragConfig={{ handle: '.drag-handle' }}>
                    {widgets.map((w) => {
                        const c = dashboardWidgets.get(w.widgetId)
                        if (!c) return null

                        return (
                            <div
                                key={w.id}
                                data-grid={{
                                    ...c.layout,
                                    id: w.id,
                                    h: w.layout?.h ?? c.layout.h,
                                    w: w.layout?.w ?? c.layout.w,
                                    x: w.layout?.x ?? c.layout.x,
                                    y: w.layout?.y ?? c.layout.y,
                                }}>
                                <c.Componente {...w} />
                            </div>
                        )
                    })}
                </Responsive>
            </div>
        </DashboardContext.Provider>
    )
}
