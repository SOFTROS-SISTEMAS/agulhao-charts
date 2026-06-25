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
            grid: {
                bottom: 64,
            },
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
            legend: {
                bottom: 0,
            },
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
            grid: {
                bottom: 64,
            },
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
            legend: {
                bottom: 0,
            },
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

    it('permite desabilitar a legenda do grafico', () => {
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
                ],
            },
            mapeamento: {
                eixoX: 'dia',
                eixoY: 'valor',
            },
            opcoes: {
                mostrarLegenda: false,
            },
        }

        const opcao = criarOpcaoECharts(grafico)

        expect(opcao.legend).toBeUndefined()
        expect(opcao).toMatchObject({
            grid: {},
            xAxis: {
                type: 'category',
                data: ['Seg', 'Ter'],
            },
            series: [
                {
                    data: [120, 200],
                    type: 'bar',
                },
            ],
        })
    })

    it('permite definir uma cor para a serie em graficos com eixo', () => {
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
                ],
            },
            mapeamento: {
                eixoX: 'dia',
                eixoY: 'valor',
            },
            opcoes: {
                serie: {
                    cor: [
                        {
                            nome: 'valor',
                            cor: '#0f766e',
                        },
                    ],
                },
            },
        }

        const opcao = criarOpcaoECharts(grafico)

        expect(opcao).toMatchObject({
            series: [
                {
                    type: 'line',
                    lineStyle: {
                        color: '#0f766e',
                    },
                    itemStyle: {
                        color: '#0f766e',
                    },
                },
            ],
        })
    })

    it('permite definir cores de series por lista', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'linha',
            dataset: {
                colunas: [
                    {
                        nome: 'receita',
                        tipo: 'numero',
                        rotulo: 'Receita',
                    },
                    {
                        nome: 'custo',
                        tipo: 'numero',
                        rotulo: 'Custo',
                    },
                ],
                linhas: [
                    {
                        mes: 'Jan',
                        receita: 42000,
                        custo: 24000,
                    },
                ],
            },
            mapeamento: {
                eixoX: 'mes',
                eixoY: ['receita', 'custo'],
            },
            opcoes: {
                serie: {
                    cor: [
                        {
                            nome: 'Receita',
                            cor: '#0f766e',
                        },
                        {
                            nome: 'Custo',
                            cor: '#dc2626',
                        },
                    ],
                },
            },
        }

        const opcao = criarOpcaoECharts(grafico)

        expect(opcao).toMatchObject({
            series: [
                {
                    name: 'Receita',
                    itemStyle: {
                        color: '#0f766e',
                    },
                },
                {
                    name: 'Custo',
                    itemStyle: {
                        color: '#dc2626',
                    },
                },
            ],
        })
    })

    it('permite definir cores por linha em graficos de pizza', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'pizza',
            dataset: {
                linhas: [
                    {
                        origem: 'Busca',
                        acessos: 1048,
                        cor: '#0f766e',
                    },
                    {
                        origem: 'Direto',
                        acessos: 735,
                        cor: '#2563eb',
                    },
                ],
            },
            mapeamento: {
                rotulo: 'origem',
                valor: 'acessos',
                cor: 'cor',
            },
        }

        const opcao = criarOpcaoECharts(grafico)

        expect(opcao).toMatchObject({
            series: [
                {
                    type: 'pie',
                    data: [
                        {
                            name: 'Busca',
                            value: 1048,
                            itemStyle: {
                                color: '#0f766e',
                            },
                        },
                        {
                            name: 'Direto',
                            value: 735,
                            itemStyle: {
                                color: '#2563eb',
                            },
                        },
                    ],
                },
            ],
        })
    })

    it('cria uma opcao de grafico gauge', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'gauge',
            titulo: 'Meta atingida',
            dataset: {
                linhas: [
                    {
                        indicador: 'Conversao',
                        percentual: 72,
                    },
                ],
            },
            mapeamento: {
                rotulo: 'indicador',
                valor: 'percentual',
            },
            opcoes: {
                serie: {
                    nome: 'Performance',
                    cor: [
                        {
                            nome: 'Performance',
                            cor: '#0f766e',
                        },
                    ],
                },
                gauge: {
                    minimo: 0,
                    maximo: 100,
                    mostrarProgresso: true,
                },
            },
        }

        const opcao = criarOpcaoECharts(grafico)

        expect(opcao).toMatchObject({
            title: {
                text: 'Meta atingida',
            },
            tooltip: {
                trigger: 'item',
            },
            series: [
                {
                    name: 'Performance',
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    progress: {
                        show: true,
                        itemStyle: {
                            color: '#0f766e',
                        },
                    },
                    itemStyle: {
                        color: '#0f766e',
                    },
                    data: [
                        {
                            name: 'Conversao',
                            value: 72,
                        },
                    ],
                },
            ],
        })
    })
})
