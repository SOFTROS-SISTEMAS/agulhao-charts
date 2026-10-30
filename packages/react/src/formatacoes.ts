// 123.767,90 -> 123767.90
export const removeMilhares = (numero: string | number) => {
    return String(numero).replace(/[.]/g, '').replace(/[,]/g, '.')
}

// 123767.90345 -> 123.767,90
export function milhares(numero: string | number = '', prefix?: string) {
    const comeco = prefix ? prefix + ' ' : ''
    if (!numero) return comeco + '0,00'

    const formata = () => {
        let x = String(numero)
        if (x.match(',')) {
            x = removeMilhares(numero)
        }
        return x
    }

    const n = String(Number(formata()).toFixed(2)).replace('.', ',')
    return comeco + n.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const inteiro = (numero: string | number = '') => {
    if (!numero) return '0'

    if (String(numero).includes('.')) {
        numero = Math.round(Number(numero))
    }

    const formatado = String(numero).replace(/\D/g, '')
    const mascara = formatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    return mascara
}

export const zero = (n: string | number, qtd: number = 2) => {
    return ('0' + n).slice(qtd * -1)
}
