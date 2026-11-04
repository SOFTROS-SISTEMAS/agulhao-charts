import { LayoutItem } from 'react-grid-layout'
import { AgulhaoDashboardWidget } from '../types'
import { AcompanhamentoPedidos, AcompanhamentoPedidosLayout } from './acompanhamentoPedidos'
import { GraficoVendasUltimos12Meses, GraficoVendasUltimos12MesesLayout } from './graficoVendasUltimos12meses'
import { GraficoReceitasMesPlanoContas, GraficoReceitasMesPlanoContasLayout } from './graficoReceitasMesPlanoContas'
import { GraficoVendasMesTipoLancamento, GraficoVendasMesTipoLancamentoLayout } from './graficoVendasMesTipoLancamento'
import { GraficoDespesasMesGrupoPlanoContas, GraficoDespesasMesGrupoPlanoContasLayout } from './graficoDespesasMesGrupoPlanoContas'
import {
    IndicadoresOrcamentosAprovadosFaturadosEntregues,
    IndicadoresOrcamentosAprovadosFaturadosEntreguesLayout,
} from './indicadoresOrcamentosAprovadosFaturadosEntregues'
import { IndicadoresReceberPagar, IndicadoresReceberPagarLayout } from './indicadoresReceberPagar'
import { IndicadoresSaldoContas, IndicadoresSaldoContasLayout } from './indicadoresSaldoContas'

export const dashboardWidgets: Map<
    string,
    {
        Componente: (p: AgulhaoDashboardWidget) => React.JSX.Element
        layout: LayoutItem
    }
> = new Map([
    [
        'acompanhamentoPedidos',
        {
            Componente: AcompanhamentoPedidos,
            layout: AcompanhamentoPedidosLayout,
        },
    ],
    [
        'graficoVendasUltimos12meses',
        {
            Componente: GraficoVendasUltimos12Meses,
            layout: GraficoVendasUltimos12MesesLayout,
        },
    ],
    [
        'graficoReceitasMesPlanoContas',
        {
            Componente: GraficoReceitasMesPlanoContas,
            layout: GraficoReceitasMesPlanoContasLayout,
        },
    ],
    [
        'graficoVendasMesTipoLancamento',
        {
            Componente: GraficoVendasMesTipoLancamento,
            layout: GraficoVendasMesTipoLancamentoLayout,
        },
    ],
    [
        'graficoDespesasMesGrupoPlanoContas',
        {
            Componente: GraficoDespesasMesGrupoPlanoContas,
            layout: GraficoDespesasMesGrupoPlanoContasLayout,
        },
    ],
    [
        'indicadoresOrcamentosAprovadosFaturadosEntregues',
        {
            Componente: IndicadoresOrcamentosAprovadosFaturadosEntregues,
            layout: IndicadoresOrcamentosAprovadosFaturadosEntreguesLayout,
        },
    ],
    [
        'indicadoresReceberPagar',
        {
            Componente: IndicadoresReceberPagar,
            layout: IndicadoresReceberPagarLayout,
        },
    ],
    [
        'indicadoresSaldoContas',
        {
            Componente: IndicadoresSaldoContas,
            layout: IndicadoresSaldoContasLayout,
        },
    ],
])
