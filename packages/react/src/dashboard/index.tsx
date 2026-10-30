import { Responsive, LayoutItem, useContainerWidth } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from './types'
import { dashboardWidgets } from './widgets'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './dashboard.css'

interface AgulhaoDashboardProps {
    widgets: AgulhaoDashboardWidget[]
}

export function AgulhaoDashboard({ widgets }: AgulhaoDashboardProps) {
    const { width, containerRef } = useContainerWidth()

    return (
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
                            {c.componente(w)}
                        </div>
                    )
                })}
            </Responsive>
        </div>
    )
}
