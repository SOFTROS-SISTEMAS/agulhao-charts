import { validarCampoExistente } from './utils/dataset.js'
import { converterParaNumero, formatarNumero, normalizarValor } from './utils/normalizacoes.js'
import type { DefinicaoGrafico } from './types.js'

export type ItemRankingGrafico = {
    posicao: number
    rotulo: string
    valor: number
    valorFormatado: string
    cor?: string
}

export type DadosRankingGrafico = {
    titulo?: string
    subtitulo?: string
    mostrarPodio: boolean
    itens: ItemRankingGrafico[]
    maximo: number
}

/**
 * Normaliza uma definicao de ranking para renderizadores que nao dependem de
 * ECharts, como React, HTML estatico e SVG em SSR.
 */
export function criarDadosRanking(grafico: DefinicaoGrafico): DadosRankingGrafico {
    validarGraficoRanking(grafico)

    const campoRotulo = grafico.mapeamento.rotulo as string
    const campoValor = grafico.mapeamento.valor as string
    const campoCor = grafico.mapeamento.cor
    const ordem = grafico.opcoes?.ranking?.ordem ?? 'decrescente'
    const limite = grafico.opcoes?.ranking?.limite
    const formatadorValor = grafico.opcoes?.ranking?.formatadorValor ?? formatarNumero
    const itensOrdenados = grafico.dataset.linhas
        .map((linha) => ({
            rotulo: normalizarValor(linha[campoRotulo]),
            valor: converterParaNumero(linha[campoValor]),
            cor: campoCor ? normalizarValor(linha[campoCor]) : undefined,
        }))
        .sort((a, b) => (ordem === 'decrescente' ? b.valor - a.valor : a.valor - b.valor))
        .slice(0, limite && limite > 0 ? limite : undefined)
        .map<ItemRankingGrafico>((item, indice) => ({
            ...item,
            posicao: indice + 1,
            valorFormatado: formatadorValor(item.valor),
        }))

    const maximo = itensOrdenados.reduce((maior, item) => Math.max(maior, item.valor), 0)

    return {
        titulo: grafico.titulo,
        subtitulo: grafico.opcoes?.subtitulo,
        mostrarPodio: grafico.opcoes?.ranking?.mostrarPodio ?? true,
        itens: itensOrdenados,
        maximo,
    }
}

function validarGraficoRanking(grafico: DefinicaoGrafico): void {
    if (!grafico.dataset || !Array.isArray(grafico.dataset.linhas)) {
        throw new Error('As linhas do dataset do grafico devem ser um array.')
    }

    if (!grafico.mapeamento.rotulo || !grafico.mapeamento.valor) {
        throw new Error('Graficos de ranking exigem mapeamento.rotulo e mapeamento.valor.')
    }

    validarCampoExistente(grafico.dataset.linhas, grafico.mapeamento.rotulo)
    validarCampoExistente(grafico.dataset.linhas, grafico.mapeamento.valor)

    if (grafico.mapeamento.cor) {
        validarCampoExistente(grafico.dataset.linhas, grafico.mapeamento.cor)
    }
}
