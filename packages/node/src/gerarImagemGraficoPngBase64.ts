import sharp from 'sharp'
import { gerarImagemGraficoBase64 } from './gerarImagemGraficoBase64.js'
import type { DefinicaoGrafico } from '@softros-sistemas/agulhao-charts-core'
import type { ImagemGraficoPngBase64, OpcoesImagemGrafico } from './types.js'

/**
 * Gera uma imagem PNG em base64 a partir da definicao comum do grafico.
 */
export async function gerarImagemGraficoPngBase64(grafico: DefinicaoGrafico, opcoes: OpcoesImagemGrafico = {}): Promise<ImagemGraficoPngBase64> {
    const imagemSvg = gerarImagemGraficoBase64(grafico, opcoes)
    const buffer = await sharp(Buffer.from(imagemSvg.svg, 'utf8')).png().toBuffer()
    const base64 = buffer.toString('base64')

    return {
        mimeType: 'image/png',
        base64,
        dataUri: `data:image/png;base64,${base64}`,
        buffer,
    }
}
