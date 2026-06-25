export type TipoGrafico = 'barra' | 'linha' | 'area' | 'pizza' | 'gauge'
export type TipoColunaGrafico = 'texto' | 'numero' | 'data' | 'dataHora' | 'booleano'
export type ValorGrafico = string | number | boolean | Date | null
export type LinhaGrafico = Record<string, ValorGrafico>

export type ColunaGrafico = {
    nome: string
    tipo: TipoColunaGrafico
    rotulo?: string
}

export type DatasetGrafico = {
    colunas?: ColunaGrafico[]
    linhas: LinhaGrafico[]
}

export type MapeamentoGrafico = {
    eixoX?: string
    eixoY?: string | string[]
    serie?: string
    rotulo?: string
    valor?: string
    cor?: string
}

export type CorSerieGrafico = {
    nome: string
    cor: string
}

export type OpcoesGrafico = {
    empilhado?: boolean
    mostrarLegenda?: boolean
    mostrarTooltip?: boolean
    moeda?: string
    subtitulo?: string
    titulo?: {
        esquerda?: string
    }
    legenda?: {
        orientacao?: 'horizontal' | 'vertical'
        esquerda?: string
    }
    serie?: {
        nome?: string
        cor?: CorSerieGrafico[]
    }
    pizza?: {
        raio?: string
        destacarAoPassarMouse?: boolean
    }
    gauge?: {
        minimo?: number
        maximo?: number
        mostrarProgresso?: boolean
    }
}

export type DefinicaoGrafico = {
    tipo: TipoGrafico
    titulo?: string
    dataset: DatasetGrafico
    mapeamento: MapeamentoGrafico
    opcoes?: OpcoesGrafico
}
