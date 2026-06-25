import { describe, expect, it } from 'vitest'
import { gerarImagemGraficoPngBase64 } from '../src/index.js'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

describe('gerarImagemGraficoPngBase64', () => {
    it('gera uma imagem png em base64 a partir de um grafico', async () => {
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

        const imagem = await gerarImagemGraficoPngBase64(grafico, {
            largura: 640,
            altura: 480,
        })

        const bufferDecodificado = Buffer.from(imagem.base64, 'base64')

        expect(imagem.mimeType).toBe('image/png')
        expect(imagem.dataUri).toBe(`data:image/png;base64,${imagem.base64}`)
        expect(imagem.buffer.equals(bufferDecodificado)).toBe(true)
        expect(bufferDecodificado.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    })

    it('gera uma imagem png de mapa usando o mapa padrao do Brasil', async () => {
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
                mapa: {
                    nome: 'BR',
                },
            },
        }

        const imagem = await gerarImagemGraficoPngBase64(grafico, {
            largura: 640,
            altura: 480,
        })

        const bufferDecodificado = Buffer.from(imagem.base64, 'base64')

        expect(imagem.mimeType).toBe('image/png')
        expect(bufferDecodificado.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    })
})
