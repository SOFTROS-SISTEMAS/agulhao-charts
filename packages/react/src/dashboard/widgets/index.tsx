import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { AcompanhamentoPedidos, AcompanhamentoPedidosLayout } from './acompanhamentoPedidos'

export const dashboardWidgets: Map<
    string,
    {
        componente: (p: AgulhaoDashboardWidget) => React.JSX.Element
        layout: LayoutItem
    }
> = new Map([
    [
        'acompanhamentoPedidos',
        {
            componente: AcompanhamentoPedidos,
            layout: AcompanhamentoPedidosLayout,
        },
    ],
])
