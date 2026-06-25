import * as ReactEChartsModule from 'echarts-for-react'
import { useMemo } from 'react'
import { criarOpcaoECharts } from '@softros/agulhao-charts-core'
import type { ComponentType, CSSProperties } from 'react'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'
import { echarts, registrarMapasPadrao } from './registrarMapasPadrao.js'

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
export function AgulhaoChart({ grafico, largura = '100%', altura = 400, className, style, notMerge, lazyUpdate, onEvents, echarts: echartsCustomizado }: AgulhaoChartProps) {
    const option = useMemo(() => {
        registrarMapasPadrao(grafico)
        return criarOpcaoECharts(grafico)
    }, [grafico])
    const chartStyle = useMemo<CSSProperties>(
        () => ({
            width: formatarMedidaCss(largura),
            height: formatarMedidaCss(altura),
            ...style,
        }),
        [altura, largura, style],
    )

    return (
        <ReactECharts
            echarts={echartsCustomizado ?? echarts}
            option={option}
            className={className}
            style={chartStyle}
            notMerge={notMerge}
            lazyUpdate={lazyUpdate}
            onEvents={onEvents}
        />
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
