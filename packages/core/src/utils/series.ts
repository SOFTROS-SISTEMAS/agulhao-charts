import type { DefinicaoGrafico } from '../types.js'

/**
 * Resolve a cor configurada para uma serie.
 */
export function obterCorDaSerie(grafico: DefinicaoGrafico, nomeDaSerie: string, campoValor: string): string | undefined {
    const cor = grafico.opcoes?.serie?.cor

    if (!cor) {
        return undefined
    }

    return cor.find((item) => item.nome === nomeDaSerie || item.nome === campoValor)?.cor
}
