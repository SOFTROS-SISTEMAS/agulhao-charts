import { criarOpcaoECharts } from '@softros/agulhao-charts-core'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'
import type { OpcoesHtmlGrafico } from './types.js'

const ECHARTS_URL_PADRAO = 'https://cdnjs.cloudflare.com/ajax/libs/echarts/6.0.0/echarts.min.js'

/**
 * Gera uma pagina HTML simples que renderiza um grafico ECharts no navegador.
 */
export function gerarHtmlGrafico(grafico: DefinicaoGrafico, opcoes: OpcoesHtmlGrafico = {}): string {
    const opcaoECharts = criarOpcaoECharts(grafico)
    const largura = formatarMedidaCss(opcoes.largura ?? '100%')
    const altura = formatarMedidaCss(opcoes.altura ?? 400)
    const tituloDocumento = escaparHtml(opcoes.tituloDocumento ?? grafico.titulo ?? 'Agulhão Charts')
    const echartsUrl = escaparHtml(opcoes.echartsUrl ?? ECHARTS_URL_PADRAO)

    return `<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${tituloDocumento}</title>
    <style>
        html,
        body {
            margin: 0;
            min-height: 100%;
            font-family: Arial, sans-serif;
        }

        #grafico {
            width: ${largura};
            height: ${altura};
        }
    </style>
</head>
<body>
    <div id="grafico"></div>
    <script src="${echartsUrl}"></script>
    <script>
        const grafico = echarts.init(document.getElementById('grafico'));
        grafico.setOption(${JSON.stringify(opcaoECharts)});
    </script>
</body>
</html>`
}

/**
 * Converte numeros para medidas CSS em pixels e preserva strings prontas.
 */
function formatarMedidaCss(valor: number | string): string {
    if (typeof valor === 'number') {
        return `${valor}px`
    }

    return valor
}

/**
 * Escapa textos interpolados no HTML.
 */
function escaparHtml(valor: string): string {
    return valor.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}
