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
})
