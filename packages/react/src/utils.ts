import { z } from 'zod'

export function zodStringToJson<T>(str: string, schema: z.ZodType<T>) {
    const x = z
        .string()
        .transform((str, ctx) => {
            try {
                return JSON.parse(str)
            } catch (error) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'A string enviada não é um formato JSON válido.',
                })
                return z.NEVER
            }
        })
        .pipe(schema)
        .safeParse(str)

    return x
}

export const statusPedidoAgulhao = [
    {
        char: 'T',
        sigla: 'TOD',
        descricao: 'Todos',
        cor: '#292b2c',
    },
    {
        char: 'A',
        sigla: 'ABE',
        descricao: 'Aberto',
        cor: '#235DD9',
    },
    {
        char: 'F',
        sigla: 'FEC',
        descricao: 'Fechado',
        cor: '#27c255',
    },
    {
        char: 'D',
        sigla: 'DIG',
        descricao: 'Digitando',
        cor: '#F0900A',
    },
    {
        char: '',
        sigla: 'ANA',
        descricao: 'Analisando',
        cor: '#113172',
    },
    {
        char: '',
        sigla: 'ADE',
        descricao: 'Aguardando Data Envio',
        cor: '#FFB909',
    },
    {
        char: '',
        sigla: 'APR',
        descricao: 'Aprovando',
        cor: '#21ad4b',
    },
    {
        char: 'C',
        sigla: 'CAN',
        descricao: 'Cancelado',
        cor: '#db4444',
    },
    {
        char: '',
        sigla: 'EXP',
        descricao: 'PCP/Produzindo',
        cor: '#00E75C',
    },
    {
        char: '',
        sigla: 'SEP',
        descricao: 'Separando',
        cor: '#E7DD00',
    },
    {
        char: '',
        sigla: 'FAT',
        descricao: 'Faturando',
        cor: '#FFB500',
    },
    {
        char: '',
        sigla: 'DES',
        descricao: 'Despachado',
        cor: '#00B347',
    },
    {
        char: '',
        sigla: 'CFR',
        descricao: 'Conferindo',
        cor: '#006DB3',
    },
]
