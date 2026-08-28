import { describe, expect, it } from 'vitest'
import { criarDadosRanking } from '../src/index.js'
import type { DefinicaoGrafico } from '../src/index.js'

describe('criarDadosRanking', () => {
    it('ordena os itens por valor e aplica posicao, limite e podio', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'ranking',
            titulo: 'Ranking de vendedores',
            dataset: {
                linhas: [
                    { nome: 'Ana', total: 120 },
                    { nome: 'Bruno', total: 240 },
                    { nome: 'Carla', total: 180 },
                    { nome: 'Diego', total: 90 },
                ],
            },
            mapeamento: {
                rotulo: 'nome',
                valor: 'total',
            },
            opcoes: {
                subtitulo: 'Mes atual',
                ranking: {
                    limite: 3,
                },
            },
        }

        const ranking = criarDadosRanking(grafico)

        expect(ranking).toMatchObject({
            titulo: 'Ranking de vendedores',
            subtitulo: 'Mes atual',
            mostrarPodio: true,
            mostrarTotal: true,
            total: 630,
            totalFormatado: '630',
            maximo: 240,
            itens: [
                { posicao: 1, rotulo: 'Bruno', valor: 240, valorFormatado: '240' },
                { posicao: 2, rotulo: 'Carla', valor: 180, valorFormatado: '180' },
                { posicao: 3, rotulo: 'Ana', valor: 120, valorFormatado: '120' },
            ],
        })
    })

    it('permite ordenar do menor para o maior', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'ranking',
            dataset: {
                linhas: [
                    { nome: 'Ana', total: 120 },
                    { nome: 'Bruno', total: 240 },
                ],
            },
            mapeamento: {
                rotulo: 'nome',
                valor: 'total',
            },
            opcoes: {
                ranking: {
                    ordem: 'crescente',
                    mostrarPodio: false,
                    mostrarTotal: false,
                },
            },
        }

        const ranking = criarDadosRanking(grafico)

        expect(ranking.mostrarPodio).toBe(false)
        expect(ranking.mostrarTotal).toBe(false)
        expect(ranking.itens.map((item) => item.rotulo)).toEqual(['Ana', 'Bruno'])
    })

    it('calcula e formata o total antes de aplicar o limite', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'ranking',
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
            opcoes: {
                ranking: {
                    limite: 1,
                    formatadorValor: (valor) => `R$ ${valor}`,
                },
            },
        }

        const ranking = criarDadosRanking(grafico)

        expect(ranking.itens).toHaveLength(1)
        expect(ranking.total).toBe(540)
        expect(ranking.totalFormatado).toBe('R$ 540')
    })
})
