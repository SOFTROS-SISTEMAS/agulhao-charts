import * as ReactEChartsModule from 'echarts-for-react'
import { useMemo } from 'react'
import { CSS_RANKING_GRAFICO, criarHtmlRankingGrafico, criarOpcaoECharts } from '@softros/agulhao-charts-core'
import type { ComponentType, CSSProperties } from 'react'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'
import { registrarMapasPadrao } from './registrarMapasPadrao.js'

export type AgulhaoChartProps = {
    grafico: DefinicaoGrafico
    largura?: number | string
    altura?: number | string
    className?: string
    style?: CSSProperties
    notMerge?: boolean
    lazyUpdate?: boolean
    onEvents?: Record<string, (params: unknown) => void>
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
