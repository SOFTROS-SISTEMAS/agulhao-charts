export type TipoGrafico = 'barra' | 'linha' | 'area' | 'pizza' | 'gauge' | 'mapa' | 'ranking'
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

export type RotuloGrafico = {
    mostrar?: boolean
    formato?: string
    tamanhoFonte?: number
    alturaLinha?: number
    espacamento?: number
    posicao?: 'inside' | 'top' | 'left' | 'right' | 'bottom' | 'center'
    linha?: {
        comprimento?: number
        comprimento2?: number
        suave?: boolean
    }
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
    rotulo?: RotuloGrafico
    pizza?: {
        raio?: string
        destacarAoPassarMouse?: boolean
    }
    gauge?: {
        minimo?: number
        maximo?: number
        mostrarProgresso?: boolean
    }
    mapa?: {
        nome?: string
        permitirZoom?: boolean
        mostrarRotuloAoDestacar?: boolean
        tamanho?: string
        centro?: {
            x?: string
            y?: string
        }
        escalaVisual?: {
            minimo?: number
            maximo?: number
            cores?: string[]
            textoSuperior?: string
            textoInferior?: string
            calculavel?: boolean
            esquerda?: string
        }
    }
    ranking?: {
        limite?: number
        mostrarPodio?: boolean
        mostrarTotal?: boolean
        ordem?: 'decrescente' | 'crescente'
        formatadorValor?: (valor: number) => string
    }
}

export type DefinicaoGrafico = {
    tipo: TipoGrafico
    titulo?: string
    dataset: DatasetGrafico
    mapeamento: MapeamentoGrafico
    opcoes?: OpcoesGrafico
}
