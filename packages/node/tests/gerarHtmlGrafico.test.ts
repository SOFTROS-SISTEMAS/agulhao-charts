import { describe, expect, it } from 'vitest'
import { gerarHtmlGrafico } from '../src/index.js'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

describe('gerarHtmlGrafico', () => {
    it('gera um html com a opcao ECharts traduzida pelo core', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'linha',
            titulo: 'Vendas por dia',
            dataset: {
                linhas: [
                    {
                        dia: 'Seg',
                        valor: 150,
                    },
                    {
                        dia: 'Ter',
                        valor: 230,
                    },
                ],
            },
            mapeamento: {
                eixoX: 'dia',
                eixoY: 'valor',
            },
        }

        const html = gerarHtmlGrafico(grafico, {
            largura: 800,
            altura: 600,
            tituloDocumento: 'Grafico de teste',
        })

        expect(html).toContain('<title>Grafico de teste</title>')
        expect(html).toContain('width: 800px;')
        expect(html).toContain('height: 600px;')
        expect(html).toContain('"data":["Seg","Ter"]')
        expect(html).toContain('"data":[150,230]')
        expect(html).toContain('"type":"line"')
    })
})
