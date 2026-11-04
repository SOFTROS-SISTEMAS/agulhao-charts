import * as ReactEChartsModule from 'echarts-for-react'
import { useMemo } from 'react'
import { CSS_RANKING_GRAFICO, criarHtmlRankingGrafico, criarOpcaoECharts } from '@softros/agulhao-charts-core'
import type { ComponentType, CSSProperties } from 'react'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'
import { registrarMapasPadrao } from './registrarMapasPadrao.js'

export type AgulhaoChartProps = {
    /**
     * Definição declarativa do gráfico (tipo, dataset, mapeamento e opções).
     *
     * É traduzida para um `EChartsOption` via `criarOpcaoECharts` do core, exceto
     * quando `grafico.tipo === 'ranking'`, caso em que é renderizada como HTML
     * (via `criarHtmlRankingGrafico`) em vez de um gráfico ECharts.
     *
     * Trocar o valor de `grafico` entre renders recalcula a option (e, para
     * `tipo: 'mapa'`, pode registrar um novo GeoJSON — ver `registrarMapasPadrao`).
     */
    grafico: DefinicaoGrafico
    /**
     * Largura do container do gráfico.
     *
     * Números são tratados como pixels (ex.: `400` vira `'400px'`); strings são
     * usadas como medida CSS literal (ex.: `'100%'`, `'50vw'`).
     *
     * @default '100%'
     */
    largura?: number | string
    /**
     * Altura do container do gráfico.
     *
     * Números são tratados como pixels (ex.: `400` vira `'400px'`); strings são
     * usadas como medida CSS literal (ex.: `'400px'`, `'60vh'`).
     *
     * @default 400
     */
    altura?: number | string
    /**
     * Classe CSS aplicada ao elemento raiz do componente.
     *
     * Para `grafico.tipo === 'ranking'`, é concatenada com a classe fixa
     * `agulhao-ranking` (ex.: `'agulhao-ranking minha-classe'`); para os demais
     * tipos, é repassada direto para o `className` do `echarts-for-react`.
     */
    className?: string
    /**
     * Estilos inline aplicados ao container do gráfico.
     *
     * É mesclado com `{ width, height }` calculados a partir de `largura`/`altura`
     * (as chaves de `style` têm precedência sobre `width`/`height` se definidas
     * explicitamente). Ignorado para `grafico.tipo === 'ranking'` apenas quanto a
     * `width`/`height` automáticos — `style` ainda é aplicado ao elemento raiz.
     */
    style?: CSSProperties
    /**
     * Repassado para a prop `notMerge` do `echarts-for-react`.
     *
     * Quando `true`, a option é substituída inteiramente a cada atualização em
     * vez de fazer merge com a option anterior do ECharts. Sem efeito quando
     * `grafico.tipo === 'ranking'` (não há instância ECharts nesse caso).
     *
     * @default false
     */
    notMerge?: boolean
    /**
     * Repassado para a prop `lazyUpdate` do `echarts-for-react`.
     *
     * Quando `true`, adia a atualização do gráfico para o próximo frame em vez
     * de aplicá-la de forma síncrona. Sem efeito quando `grafico.tipo === 'ranking'`.
     *
     * @default false
     */
    lazyUpdate?: boolean
    /**
     * Mapa de handlers de eventos do ECharts, repassado para a prop `onEvents`
     * do `echarts-for-react`.
     *
     * A chave é o nome do evento do ECharts (ex.: `'click'`, `'legendselectchanged'`)
     * e o valor é o handler, chamado com os `params` que o ECharts fornece para
     * aquele evento. Sem efeito quando `grafico.tipo === 'ranking'`.
     *
     * @example
     * ```tsx
     * <AgulhaoChart grafico={grafico} onEvents={{ click: (params) => console.log(params) }} />
     * ```
     */
    onEvents?: Record<string, (params: unknown) => void>
    /**
     * Instância customizada do módulo `echarts` (ex.: build com apenas os
     * componentes necessários), repassada tanto para `registrarMapasPadrao`
     * (registro de mapas para `tipo: 'mapa'`) quanto para a prop `echarts` do
     * `echarts-for-react`.
     *
     * Se omitido, usa a instância padrão resolvida pelo `echarts-for-react`/core.
     * Sem efeito quando `grafico.tipo === 'ranking'`.
     */
    echarts?: unknown
}

type ReactEChartsProps = {
    option: unknown
    className?: string
    style?: CSSProperties
    notMerge?: boolean
    lazyUpdate?: boolean
    onEvents?: Record<string, (params: unknown) => void>
    echarts?: unknown
}

const ReactECharts = (ReactEChartsModule.default ?? ReactEChartsModule) as unknown as ComponentType<ReactEChartsProps>

/**
 * Componente do Agulhao Charts.
 */
export function AgulhaoChart({
    grafico,
    largura = '100%',
    altura = 400,
    className,
    style,
    notMerge,
    lazyUpdate,
    onEvents,
    echarts: echartsCustomizado,
}: AgulhaoChartProps) {
    const option = useMemo(() => {
        if (grafico.tipo === 'ranking') {
            return undefined
        }

        registrarMapasPadrao(grafico, echartsCustomizado)
        return criarOpcaoECharts(grafico)
    }, [echartsCustomizado, grafico])

    const chartStyle = useMemo<CSSProperties>(
        () => ({
            width: formatarMedidaCss(largura),
            height: formatarMedidaCss(altura),
            ...style,
        }),
        [altura, largura, style],
    )

    if (grafico.tipo === 'ranking') {
        return <RankingChart grafico={grafico} className={className} style={chartStyle} />
    }

    return (
        <ReactECharts
            echarts={echartsCustomizado}
            option={option}
            className={className}
            style={chartStyle}
            notMerge={notMerge}
            lazyUpdate={lazyUpdate}
            onEvents={onEvents}
        />
    )
}

function RankingChart({ grafico, className, style }: { grafico: DefinicaoGrafico; className?: string; style?: CSSProperties }) {
    const html = useMemo(() => criarHtmlRankingGrafico(grafico), [grafico])
    const classeRanking = className ? `agulhao-ranking ${className}` : 'agulhao-ranking'

    return (
        <>
            <style>{CSS_RANKING_GRAFICO}</style>
            <section className={classeRanking} style={style} dangerouslySetInnerHTML={{ __html: html }} />
        </>
    )
}

/**
 * Converte medidas numericas para pixels e preserva medidas CSS textuais.
 */
function formatarMedidaCss(valor: number | string): string {
    if (typeof valor === 'number') {
        return `${valor}px`
    }

    return valor
}
