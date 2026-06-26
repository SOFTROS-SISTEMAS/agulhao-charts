import { describe, expect, it } from 'vitest'
import { AgulhaoChart } from '../src/index.js'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

describe('AgulhaoChart', () => {
    it('exporta um componente React que recebe uma definicao de grafico', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'linha',
            dataset: {
                linhas: [
                    {
                        dia: 'Seg',
                        valor: 150,
                    },
                ],
            },
            mapeamento: {
                eixoX: 'dia',
                eixoY: 'valor',
            },
        }

        expect(typeof AgulhaoChart).toBe('function')
        expect(grafico.tipo).toBe('linha')
    })

    it('aceita grafico de mapa com o mapa padrao do Brasil', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'mapa',
            dataset: {
                linhas: [
                    {
                        estado: 'São Paulo',
                        valor: 46649,
                    },
                ],
            },
            mapeamento: {
                rotulo: 'estado',
                valor: 'valor',
            },
            opcoes: {
                mapa: {
                    nome: 'BR',
                },
            },
        }

        expect(typeof AgulhaoChart).toBe('function')
        expect(grafico.opcoes?.mapa?.nome).toBe('BR')
    })

    it('aceita grafico de ranking sem exigir eixos', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'ranking',
            dataset: {
                linhas: [
                    {
                        nome: 'Ana',
                        total: 120,
                    },
                ],
            },
            mapeamento: {
                rotulo: 'nome',
                valor: 'total',
            },
        }

        expect(typeof AgulhaoChart).toBe('function')
        expect(grafico.tipo).toBe('ranking')
    })
})
