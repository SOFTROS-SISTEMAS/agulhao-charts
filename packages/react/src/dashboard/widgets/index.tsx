import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { AcompanhamentoPedidos, AcompanhamentoPedidosLayout } from './acompanhamentoPedidos'
import { GraficoVendasUltimos12Meses, GraficoVendasUltimos12MesesLayout } from './graficoVendasUltimos12meses'
import { GraficoReceitasMesPlanoContas, GraficoReceitasMesPlanoContasLayout } from './graficoReceitasMesPlanoContas'
import { GraficoVendasMesTipoLancamento, GraficoVendasMesTipoLancamentoLayout } from './graficoVendasMesTipoLancamento'
import { GraficoDespesasMesGrupoPlanoContas, GraficoDespesasMesGrupoPlanoContasLayout } from './graficoDespesasMesGrupoPlanoContas'

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
    [
        'graficoVendasUltimos12meses',
        {
            componente: GraficoVendasUltimos12Meses,
            layout: GraficoVendasUltimos12MesesLayout,
        },
    ],
    [
        'graficoReceitasMesPlanoContas',
        {
            componente: GraficoReceitasMesPlanoContas,
            layout: GraficoReceitasMesPlanoContasLayout,
        },
    ],
    [
        'graficoVendasMesTipoLancamento',
        {
            componente: GraficoVendasMesTipoLancamento,
            layout: GraficoVendasMesTipoLancamentoLayout,
        },
    ],
    [
        'graficoDespesasMesGrupoPlanoContas',
        {
            componente: GraficoDespesasMesGrupoPlanoContas,
            layout: GraficoDespesasMesGrupoPlanoContasLayout,
        },
    ],
])
