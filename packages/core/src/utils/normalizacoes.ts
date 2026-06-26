import type { ValorGrafico } from '../types.js'

/**
 * Normaliza um campo que pode ser unico ou uma lista.
 */
export function transformarEmListaDeCampos(campo: string | string[] | undefined): string[] {
    if (!campo) {
        return []
    }

    return Array.isArray(campo) ? campo : [campo]
}

/**
 * Soma valores numericos, tratando valores nao numericos como zero.
 */
export function somarValores(valores: ValorGrafico[]): number {
    return valores.reduce<number>((total, valor) => total + converterParaNumero(valor), 0)
}

/**
 * Converte um valor do dataset para numero.
 */
export function converterParaNumero(valor: ValorGrafico): number {
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
export function normalizarValor(valor: ValorGrafico): string {
    if (valor instanceof Date) {
        return valor.toISOString()
    }

    if (valor === null) {
        return ''
    }

    return String(valor)
}

export function formatarNumero(valor: number): string {
    return new Intl.NumberFormat('pt-BR').format(valor)
}

export function obterMinimo(valores: number[]): number {
    return valores.length > 0 ? Math.min(...valores) : 0
}

export function obterMaximo(valores: number[]): number {
    return valores.length > 0 ? Math.max(...valores) : 0
}
