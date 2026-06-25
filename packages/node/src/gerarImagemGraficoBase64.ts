import { createRequire } from 'node:module'
import { criarOpcaoECharts } from '@softros/agulhao-charts-core'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'
import type * as ECharts from 'echarts/types/dist/echarts'
import type { ImagemGraficoBase64, OpcoesImagemGrafico } from './types.js'

const require = createRequire(import.meta.url)
const echarts = require('echarts') as typeof ECharts

/**
 * Gera uma imagem SVG em base64 a partir da definicao comum do grafico.
 */
export function gerarImagemGraficoBase64(grafico: DefinicaoGrafico, opcoes: OpcoesImagemGrafico = {}): ImagemGraficoBase64 {
    const largura = opcoes.largura ?? 800
    const altura = opcoes.altura ?? 600
    const instancia = echarts.init(null, null, {
        renderer: 'svg',
        ssr: true,
        width: largura,
        height: altura,
    })

    try {
        instancia.setOption(criarOpcaoECharts(grafico))

        const svg = instancia.renderToSVGString()
        const base64 = Buffer.from(svg, 'utf8').toString('base64')

        return {
            mimeType: 'image/svg+xml',
            base64,
            dataUri: `data:image/svg+xml;base64,${base64}`,
            svg,
        }
    } finally {
        instancia.dispose()
    }
}
