import { normalizarValor } from './normalizacoes.js'
import type { DefinicaoGrafico, LinhaGrafico } from '../types.js'

/**
 * Confere se um campo citado no mapeamento existe nas linhas do dataset.
 */
export function validarCampoExistente(linhas: LinhaGrafico[], campo: string): void {
    if (linhas.length === 0) {
        return
    }

    if (!(campo in linhas[0])) {
        throw new Error(`O campo "${campo}" nao foi encontrado no dataset.`)
    }
}

/**
 * Obtem os valores distintos de uma coluna do dataset.
 */
export function obterValoresUnicos(linhas: LinhaGrafico[], campo: string | undefined): string[] {
    if (!campo) {
        return []
    }

    return Array.from(new Set(linhas.map((linha) => normalizarValor(linha[campo]))))
}

/**
 * Busca o rotulo amigavel de um campo nos metadados do dataset.
 */
export function obterRotuloDoCampo(grafico: DefinicaoGrafico, campo: string): string {
    return grafico.dataset.colunas?.find((coluna) => coluna.nome === campo)?.rotulo ?? campo
}
