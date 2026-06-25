import type { EChartsOption } from 'echarts/types/dist/echarts'
import type { DefinicaoGrafico, LinhaGrafico, TipoGrafico, ValorGrafico } from './types.js'

/**
 * Traduz a definicao comum de grafico do Agulhao Charts para o objeto
 * `EChartsOption`, que e o formato entendido pela biblioteca ECharts.
 */
export function criarOpcaoECharts(grafico: DefinicaoGrafico): EChartsOption {
    validarGrafico(grafico)

    if (grafico.tipo === 'pizza') {
        return criarOpcaoPizza(grafico)
    }

    if (grafico.tipo === 'gauge') {
        return criarOpcaoGauge(grafico)
    }

    return criarOpcaoComEixos(grafico)
}

/**
 * Monta as opcoes de graficos que usam eixos cartesianos.
 *
 * A regra de agrupamento, soma por categoria e formatacao do eixo Y fica concentrada
 * em um unico lugar.
 */
function criarOpcaoComEixos(grafico: DefinicaoGrafico): EChartsOption {
    const { dataset, mapeamento, opcoes } = grafico
    const camposY = transformarEmListaDeCampos(mapeamento.eixoY)
    const categorias = obterValoresUnicos(dataset.linhas, mapeamento.eixoX)
    const gruposDeSerie = mapeamento.serie ? obterValoresUnicos(dataset.linhas, mapeamento.serie) : []

    return aplicarOpcoesComuns(grafico, {
        grid: {
            bottom: grafico.opcoes?.mostrarLegenda === false ? undefined : 64,
        },
        xAxis: {
            type: 'category',
            data: categorias,
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: opcoes?.moeda ? `{value} ${opcoes.moeda}` : '{value}',
            },
        },
        series:
            gruposDeSerie.length > 0 && camposY.length === 1
                ? gruposDeSerie.map((grupo) => criarSerieComEixos(grafico, camposY[0], categorias, grupo))
                : camposY.map((campo) => criarSerieComEixos(grafico, campo, categorias)),
    })
}

/**
 * Monta as opcoes especificas de grafico de pizza.
 *
 * O grafico de pizza nao usa eixo X/Y. Por isso ele le o par
 * `mapping.label`/`mapping.value` e transforma cada linha do dataset em um
 * item `{ name, value }`, que e o formato esperado pela serie `pie` do ECharts.
 */
function criarOpcaoPizza(grafico: DefinicaoGrafico): EChartsOption {
    const { dataset, mapeamento } = grafico
    const campoRotulo = mapeamento.rotulo
    const campoValor = mapeamento.valor
    const campoCor = mapeamento.cor

    return aplicarOpcoesComuns(grafico, {
        series: [
            {
                name: grafico.opcoes?.serie?.nome ?? grafico.titulo,
                type: 'pie',
                radius: grafico.opcoes?.pizza?.raio ?? '65%',
                data: dataset.linhas.map((linha) => ({
                    name: normalizarValor(linha[campoRotulo as string]),
                    value: converterParaNumero(linha[campoValor as string]),
                    itemStyle: campoCor
                        ? {
                              color: normalizarValor(linha[campoCor]),
                          }
                        : undefined,
                })),
                emphasis:
                    grafico.opcoes?.pizza?.destacarAoPassarMouse === false
                        ? undefined
                        : {
                              itemStyle: {
                                  shadowBlur: 10,
                                  shadowOffsetX: 0,
                                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                              },
                          },
            },
        ],
    })
}

/**
 * Monta as opcoes especificas de grafico gauge.
 *
 * O gauge usa `mapeamento.valor` para o valor do marcador e pode usar
 * `mapeamento.rotulo` para nomear cada leitura.
 */
function criarOpcaoGauge(grafico: DefinicaoGrafico): EChartsOption {
    const { dataset, mapeamento, opcoes } = grafico
    const campoValor = mapeamento.valor
    const campoRotulo = mapeamento.rotulo
    const corDaSerie = obterCorDaSerie(grafico, opcoes?.serie?.nome ?? grafico.titulo ?? campoValor ?? '', campoValor ?? '')

    return aplicarOpcoesComuns(grafico, {
        series: [
            {
                name: opcoes?.serie?.nome ?? grafico.titulo,
                type: 'gauge',
                min: opcoes?.gauge?.minimo,
                max: opcoes?.gauge?.maximo,
                progress: opcoes?.gauge?.mostrarProgresso
                    ? {
                          show: true,
                          itemStyle: corDaSerie
                              ? {
                                    color: corDaSerie,
                                }
                              : undefined,
                      }
                    : undefined,
                itemStyle: corDaSerie
                    ? {
                          color: corDaSerie,
                      }
                    : undefined,
                data: dataset.linhas.map((linha) => ({
                    name: campoRotulo ? normalizarValor(linha[campoRotulo]) : opcoes?.serie?.nome ?? grafico.titulo,
                    value: converterParaNumero(linha[campoValor as string]),
                })),
            },
        ],
    })
}

/**
 * Aplica configuracoes que podem existir em qualquer tipo de grafico, como
 * titulo, tooltip e legenda.
 *
 * Essa funcao evita duplicacao entre os builders especificos e garante que
 * todos os tipos respeitem os mesmos defaults visuais. O builder especifico
 * ainda pode sobrescrever propriedades se precisar.
 */
function aplicarOpcoesComuns(grafico: DefinicaoGrafico, option: EChartsOption): EChartsOption {
    return {
        title: grafico.titulo
            ? {
                  text: grafico.titulo,
                  subtext: grafico.opcoes?.subtitulo,
                  left: grafico.opcoes?.titulo?.esquerda,
              }
            : undefined,
        tooltip: grafico.opcoes?.mostrarTooltip === false ? undefined : { trigger: grafico.tipo === 'pizza' || grafico.tipo === 'gauge' ? 'item' : 'axis' },
        legend:
            grafico.opcoes?.mostrarLegenda === false
                ? undefined
                : {
                      orient: grafico.opcoes?.legenda?.orientacao,
                      left: grafico.opcoes?.legenda?.esquerda,
                      bottom: grafico.tipo === 'pizza' || grafico.tipo === 'gauge' ? undefined : 0,
                  },
        ...option,
    }
}

/**
 * Cria uma serie para graficos com eixo.
 *
 * Uma serie representa uma linha, um conjunto de barras ou uma area no
 * ECharts. Esta funcao tambem resolve o agrupamento por `mapping.series`,
 * somando os valores de cada categoria para que a entrada possa vir direto de
 * uma consulta SQL agregada ou parcialmente agregada.
 */
function criarSerieComEixos(grafico: DefinicaoGrafico, campoValor: string, categorias: string[], grupoDaSerie?: string) {
    const { dataset, mapeamento, opcoes } = grafico
    const nomeDaSerie = grupoDaSerie ?? obterRotuloDoCampo(grafico, campoValor)
    const corDaSerie = obterCorDaSerie(grafico, nomeDaSerie, campoValor)

    return {
        name: nomeDaSerie,
        type: traduzirTipoGrafico(grafico.tipo),
        stack: opcoes?.empilhado ? 'total' : undefined,
        areaStyle: grafico.tipo === 'area' ? {} : undefined,
        lineStyle:
            corDaSerie && grafico.tipo !== 'barra'
                ? {
                      color: corDaSerie,
                  }
                : undefined,
        itemStyle: corDaSerie
            ? {
                  color: corDaSerie,
              }
            : undefined,
        data: categorias.map((categoria) =>
            somarValores(
                dataset.linhas
                    .filter((linha) => normalizarValor(linha[mapeamento.eixoX as string]) === categoria)
                    .filter((linha) => !mapeamento.serie || normalizarValor(linha[mapeamento.serie]) === grupoDaSerie)
                    .map((linha) => linha[campoValor]),
            ),
        ),
    }
}

/**
 * Valida se a definicao recebida possui os mapeamentos minimos para o tipo de
 * grafico solicitado.
 */
function validarGrafico(grafico: DefinicaoGrafico): void {
    if (!grafico.dataset || !Array.isArray(grafico.dataset.linhas)) {
        throw new Error('As linhas do dataset do grafico devem ser um array.')
    }

    if (grafico.tipo === 'pizza') {
        if (!grafico.mapeamento.rotulo || !grafico.mapeamento.valor) {
            throw new Error('Graficos de pizza exigem mapeamento.rotulo e mapeamento.valor.')
        }

        validarCampoExistente(grafico, grafico.mapeamento.rotulo)
        validarCampoExistente(grafico, grafico.mapeamento.valor)

        if (grafico.mapeamento.cor) {
            validarCampoExistente(grafico, grafico.mapeamento.cor)
        }

        return
    }

    if (grafico.tipo === 'gauge') {
        if (!grafico.mapeamento.valor) {
            throw new Error('Graficos gauge exigem mapeamento.valor.')
        }

        validarCampoExistente(grafico, grafico.mapeamento.valor)

        if (grafico.mapeamento.rotulo) {
            validarCampoExistente(grafico, grafico.mapeamento.rotulo)
        }

        if (grafico.mapeamento.cor) {
            validarCampoExistente(grafico, grafico.mapeamento.cor)
        }

        return
    }

    if (!grafico.mapeamento.eixoX || !grafico.mapeamento.eixoY) {
        throw new Error('Graficos com eixo exigem mapeamento.eixoX e mapeamento.eixoY.')
    }

    validarCampoExistente(grafico, grafico.mapeamento.eixoX)

    if (grafico.mapeamento.serie) {
        validarCampoExistente(grafico, grafico.mapeamento.serie)
    }

    if (grafico.mapeamento.cor) {
        validarCampoExistente(grafico, grafico.mapeamento.cor)
    }

    for (const campo of transformarEmListaDeCampos(grafico.mapeamento.eixoY)) {
        validarCampoExistente(grafico, campo)
    }
}

/**
 * Confere se um campo citado no mapping existe nas linhas do dataset.
 *
 * O objetivo e detectar erro de configuracao, por exemplo pedir `mapping.y`
 * como `total_vendas` quando a consulta retornou `valor_total`.
 */
function validarCampoExistente(grafico: DefinicaoGrafico, campo: string): void {
    if (grafico.dataset.linhas.length === 0) {
        return
    }

    if (!(campo in grafico.dataset.linhas[0])) {
        throw new Error(`O campo "${campo}" nao foi encontrado no dataset.`)
    }
}

/**
 * Normaliza um campo que pode ser unico ou uma lista.
 *
 * Isso permite que `mapping.y` aceite tanto `"total"` quanto
 * `["receita", "custo"]`, mantendo o restante do codigo trabalhando sempre
 * com array.
 */
function transformarEmListaDeCampos(campo: string | string[] | undefined): string[] {
    if (!campo) {
        return []
    }

    return Array.isArray(campo) ? campo : [campo]
}

/**
 * Obtem os valores distintos de uma coluna do dataset.
 *
 * Nos graficos com eixo, isso vira a lista de categorias do eixo X. Quando ha
 * `mapping.series`, tambem vira a lista de grupos que dara origem a varias
 * series no ECharts.
 */
function obterValoresUnicos(linhas: LinhaGrafico[], campo: string | undefined): string[] {
    if (!campo) {
        return []
    }

    return Array.from(new Set(linhas.map((linha) => normalizarValor(linha[campo]))))
}

/**
 * Soma os valores numericos de uma categoria ou grupo.
 *
 * Essa soma permite que mais de uma linha do dataset contribua para o mesmo
 * ponto do grafico. Valores nao numericos entram como zero para manter a
 * traducao previsivel.
 */
function somarValores(valores: ValorGrafico[]): number {
    return valores.reduce<number>((total, valor) => total + converterParaNumero(valor), 0)
}

/**
 * Converte um valor do dataset para numero.
 */
function converterParaNumero(valor: ValorGrafico): number {
    if (typeof valor === 'number') {
        return valor
    }

    if (typeof valor === 'string') {
        const numero = Number(valor)
        return Number.isFinite(numero) ? numero : 0
    }

    return 0
}

/**
 * Converte um valor do dataset para texto estavel.
 */
function normalizarValor(valor: ValorGrafico): string {
    if (valor instanceof Date) {
        return valor.toISOString()
    }

    if (valor === null) {
        return ''
    }

    return String(valor)
}

/**
 * Busca o rotulo amigavel de um campo.
 *
 * Quando `dataset.columns` informa um `label`, ele deve aparecer na legenda do
 * grafico. Se nao houver metadado, o nome tecnico do campo continua sendo um
 * fallback valido.
 */
function obterRotuloDoCampo(grafico: DefinicaoGrafico, campo: string): string {
    return grafico.dataset.colunas?.find((coluna) => coluna.nome === campo)?.rotulo ?? campo
}

/**
 * Resolve a cor configurada para uma serie.
 *
 * A cor e encontrada pelo nome exibido na legenda ou pelo nome tecnico do campo.
 */
function obterCorDaSerie(grafico: DefinicaoGrafico, nomeDaSerie: string, campoValor: string): string | undefined {
    const cor = grafico.opcoes?.serie?.cor

    if (!cor) {
        return undefined
    }

    return cor.find((item) => item.nome === nomeDaSerie || item.nome === campoValor)?.cor
}

/**
 * Traduz o tipo de grafico para o tipo esperado pelo ECharts.
 */
function traduzirTipoGrafico(tipo: TipoGrafico): 'bar' | 'line' {
    if (tipo === 'barra') {
        return 'bar'
    }

    return 'line'
}
