import { describe, expect, it } from 'vitest'
import { gerarImagemGraficoBase64 } from '../src/index.js'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

describe('gerarImagemGraficoBase64', () => {
    it('gera uma imagem svg em base64 a partir de um grafico', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'barra',
            titulo: 'Vendas por dia',
            dataset: {
                linhas: [
                    {
                        dia: 'Seg',
                        valor: 120,
                    },
                    {
                        dia: 'Ter',
                        valor: 200,
                    },
                ],
            },
            mapeamento: {
                eixoX: 'dia',
                eixoY: 'valor',
            },
        }

        const imagem = gerarImagemGraficoBase64(grafico, {
            largura: 640,
            altura: 480,
        })

        const svgDecodificado = Buffer.from(imagem.base64, 'base64').toString('utf8')

        expect(imagem.mimeType).toBe('image/svg+xml')
        expect(imagem.dataUri).toBe(`data:image/svg+xml;base64,${imagem.base64}`)
        expect(svgDecodificado).toContain('<svg')
        expect(svgDecodificado).toContain('width="640"')
        expect(svgDecodificado).toContain('height="480"')
        expect(svgDecodificado).toContain('Vendas por dia')
    })

    it('gera uma imagem svg de mapa usando o mapa padrao do Brasil', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'mapa',
            titulo: 'Indicador por estado',
            dataset: {
                linhas: [
                    {
                        estado: 'São Paulo',
                        valor: 46649,
                    },
                    {
                        estado: 'Minas Gerais',
                        valor: 21412,
                    },
                ],
            },
            mapeamento: {
                rotulo: 'estado',
                valor: 'valor',
            },
            opcoes: {
                mostrarLegenda: false,
                serie: {
                    nome: 'Indicador',
                },
                mapa: {
                    nome: 'BR',
                    tamanho: '82%',
                    centro: {
                        x: '43%',
                        y: '55%',
                    },
                },
            },
        }

        const imagem = gerarImagemGraficoBase64(grafico, {
            largura: 640,
            altura: 480,
        })

        const svgDecodificado = Buffer.from(imagem.base64, 'base64').toString('utf8')

        expect(imagem.mimeType).toBe('image/svg+xml')
        expect(svgDecodificado).toContain('<svg')
        expect(svgDecodificado).toContain('Indicador por estado')
    })

    it('orienta usar HTML ou PNG para grafico de ranking', () => {
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

        expect(() =>
            gerarImagemGraficoBase64(grafico, {
                largura: 640,
                altura: 480,
            }),
        ).toThrow('ranking nao sao gerados em SVG')
    })
})
