import { describe, expect, it } from 'vitest'
import { criarOpcaoECharts } from '../src/index.js'
import type { DefinicaoGrafico } from '../src/index.js'

describe('criarOpcaoECharts', () => {
    it('cria uma opcao de grafico de linha baseada no exemplo simples do ECharts', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'linha',
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
                    {
                        dia: 'Qua',
                        valor: 224,
                    },
                    {
                        dia: 'Qui',
                        valor: 218,
                    },
                    {
                        dia: 'Sex',
                        valor: 135,
                    },
                    {
                        dia: 'Sab',
                        valor: 147,
                    },
                    {
                        dia: 'Dom',
                        valor: 260,
                    },
                ],
            },
            mapeamento: {
                eixoX: 'dia',
                eixoY: 'valor',
            },
        }

        const opcao = criarOpcaoECharts(grafico)

        expect(opcao).toMatchObject({
            xAxis: {
                type: 'category',
                data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [150, 230, 224, 218, 135, 147, 260],
                    type: 'line',
                },
            ],
        })
    })

    it('cria uma opcao de grafico de barra baseada no exemplo simples do ECharts', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'barra',
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
                    {
                        dia: 'Qua',
                        valor: 150,
                    },
                    {
                        dia: 'Qui',
                        valor: 80,
                    },
                    {
                        dia: 'Sex',
                        valor: 70,
                    },
                    {
                        dia: 'Sab',
                        valor: 110,
                    },
                    {
                        dia: 'Dom',
                        valor: 130,
                    },
                ],
            },
            mapeamento: {
                eixoX: 'dia',
                eixoY: 'valor',
            },
        }

        const opcao = criarOpcaoECharts(grafico)

        expect(opcao).toMatchObject({
            xAxis: {
                type: 'category',
                data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar',
                },
            ],
        })
    })

    it('cria uma opcao de grafico de pizza baseada no exemplo simples do ECharts', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'pizza',
            titulo: 'Origem dos acessos do site',
            dataset: {
                linhas: [
                    {
                        origem: 'Mecanismo de busca',
                        acessos: 1048,
                    },
                    {
                        origem: 'Direto',
                        acessos: 735,
                    },
                    {
                        origem: 'E-mail',
                        acessos: 580,
                    },
                    {
                        origem: 'Anuncios parceiros',
                        acessos: 484,
                    },
                    {
                        origem: 'Anuncios em video',
                        acessos: 300,
                    },
                ],
            },
            mapeamento: {
                rotulo: 'origem',
                valor: 'acessos',
            },
            opcoes: {
                subtitulo: 'Dados ficticios',
                titulo: {
                    esquerda: 'center',
                },
                legenda: {
                    orientacao: 'vertical',
                    esquerda: 'left',
                },
                serie: {
                    nome: 'Acessos por origem',
                },
                pizza: {
                    raio: '50%',
                },
            },
        }

        const opcao = criarOpcaoECharts(grafico)

        expect(opcao).toMatchObject({
            title: {
                text: 'Origem dos acessos do site',
                subtext: 'Dados ficticios',
                left: 'center',
            },
            tooltip: {
                trigger: 'item',
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: 'Acessos por origem',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 1048, name: 'Mecanismo de busca' },
                        { value: 735, name: 'Direto' },
                        { value: 580, name: 'E-mail' },
                        { value: 484, name: 'Anuncios parceiros' },
                        { value: 300, name: 'Anuncios em video' },
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        })
    })
})
