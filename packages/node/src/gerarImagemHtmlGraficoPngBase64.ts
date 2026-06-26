import { chromium } from 'playwright'
import { gerarHtmlGrafico } from './gerarHtmlGrafico.js'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'
import type { ImagemGraficoPngBase64, OpcoesImagemHtmlGrafico } from './types.js'

/**
 * Gera uma imagem PNG em base64 renderizando o HTML retornado por gerarHtmlGrafico.
 */
export async function gerarImagemHtmlGraficoPngBase64(
    grafico: DefinicaoGrafico,
    opcoes: OpcoesImagemHtmlGrafico = {},
): Promise<ImagemGraficoPngBase64> {
    const largura = opcoes.largura ?? 800
    const altura = opcoes.altura ?? 600
    const timeout = opcoes.timeoutMs ?? 30_000
    const browser = await chromium.launch()

    try {
        const page = await browser.newPage({
            viewport: {
                width: largura,
                height: altura,
            },
            deviceScaleFactor: opcoes.deviceScaleFactor ?? 1,
        })
        const html = gerarHtmlGrafico(grafico, {
            largura,
            altura,
            tituloDocumento: opcoes.tituloDocumento,
            echartsUrl: opcoes.echartsUrl,
        })

        await page.setContent(html, {
            waitUntil: grafico.tipo === 'ranking' ? 'domcontentloaded' : 'networkidle',
            timeout,
        })

        const buffer = await page.locator('#grafico').screenshot({ type: 'png' })
        const base64 = buffer.toString('base64')

        return {
            mimeType: 'image/png',
            base64,
            dataUri: `data:image/png;base64,${base64}`,
            buffer,
        }
    } finally {
        await browser.close()
    }
}
