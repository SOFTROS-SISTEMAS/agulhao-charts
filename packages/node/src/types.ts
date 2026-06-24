export type OpcoesHtmlGrafico = {
    largura?: number | string
    altura?: number | string
    tituloDocumento?: string
    echartsUrl?: string
}

export type OpcoesImagemGrafico = {
    largura?: number
    altura?: number
}

export type ImagemGraficoSvgBase64 = {
    mimeType: 'image/svg+xml'
    base64: string
    dataUri: string
    svg: string
}

export type ImagemGraficoPngBase64 = {
    mimeType: 'image/png'
    base64: string
    dataUri: string
    buffer: Buffer
}

export type ImagemGraficoBase64 = ImagemGraficoSvgBase64
