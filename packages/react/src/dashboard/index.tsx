import { Responsive, LayoutItem, useContainerWidth } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from './types'
import { dashboardWidgets } from './widgets'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './dashboard.css'
import { DashboardContext } from './context'

interface AgulhaoDashboardProps {
    widgets: AgulhaoDashboardWidget[]
}

export function AgulhaoDashboard({ widgets }: AgulhaoDashboardProps) {
    const { width, containerRef } = useContainerWidth({ debounceTimeout: 100 })

    return (
        <DashboardContext.Provider
            value={{
                atualizaWidget: (widgetId: string, id: string) => {
                    console.log('atualizaWidget', widgetId, id)
                    return Promise.resolve(null)
                },
            }}>
            <div style={{ flex: 1, height: '100%', overflowY: 'auto' }}>
                <Responsive
                    innerRef={containerRef}
                    width={width}
                    // onLayoutChange={atualizarLayout}
                    dragConfig={{ handle: '.drag-handle' }}
                    onDragStart={() => {
                        // classe('movendo', 'drag-handle')
                    }}
                    onDragStop={() => {
                        // classe('movendo', 'drag-handle', true)
                    }}
                    onResizeStart={() => {
                        // classe('naoCopia', 'react-resizable')
                    }}
                    onResizeStop={() => {
                        // classe('naoCopia', 'react-resizable', true)
                    }}>
                    {widgets.map((w) => {
                        const c = dashboardWidgets.get(w.widgetId)
                        if (!c) return null

                        return (
                            <div key={w.id} data-grid={{ ...c.layout, ...w.layout, id: w.id }}>
                                <c.Componente {...w} />
                            </div>
                        )
                    })}
                </Responsive>
            </div>
        </DashboardContext.Provider>
    )
}
