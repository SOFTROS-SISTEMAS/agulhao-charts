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

    it('registra o mapa padrao do Brasil no html de grafico de mapa', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'mapa',
            titulo: 'Indicador por estado',
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

        const html = gerarHtmlGrafico(grafico)

        expect(html).toContain("echarts.registerMap('BR'")
        expect(html).toContain('"type":"FeatureCollection"')
        expect(html).toContain('"map":"BR"')
    })

    it('gera html de ranking sem carregar ECharts', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'ranking',
            titulo: 'Ranking de vendedores',
            dataset: {
                linhas: [
                    { nome: 'Ana', total: 120 },
                    { nome: 'Bruno', total: 240 },
                    { nome: 'Carla', total: 180 },
                ],
            },
            mapeamento: {
                rotulo: 'nome',
                valor: 'total',
            },
        }

        const html = gerarHtmlGrafico(grafico)

        expect(html).toContain('Ranking de vendedores')
        expect(html).toContain('Bruno')
        expect(html).toContain('Carla')
        expect(html).toContain('Ana')
        expect(html).toContain('class="agulhao-ranking-podio"')
        expect(html).not.toContain('echarts.init')
        expect(html).not.toContain('echarts.min.js')
    })
})
