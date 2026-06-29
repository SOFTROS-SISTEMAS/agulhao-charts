import { describe, expect, it } from 'vitest'
import { CSS_RANKING_GRAFICO, criarHtmlRankingGrafico } from '../src/index.js'
import type { DefinicaoGrafico } from '../src/index.js'

describe('criarHtmlRankingGrafico', () => {
    it('gera o html compartilhado do ranking', () => {
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

        const html = criarHtmlRankingGrafico(grafico)

        expect(CSS_RANKING_GRAFICO).toContain('.agulhao-ranking')
        expect(html).toContain('Ranking de vendedores')
        expect(html).toContain('Bruno')
        expect(html).toContain('Carla')
        expect(html).toContain('Ana')
        expect(html).toContain('class="agulhao-ranking-podio"')
        expect(html).toContain('class="agulhao-ranking-lista"')
    })

    it('escapa textos interpolados no html', () => {
        const grafico: DefinicaoGrafico = {
            tipo: 'ranking',
            titulo: 'Ranking <script>',
            dataset: {
                linhas: [{ nome: 'Ana & Bruno', total: 120 }],
            },
            mapeamento: {
                rotulo: 'nome',
                valor: 'total',
            },
        }

        const html = criarHtmlRankingGrafico(grafico)

        expect(html).toContain('Ranking &lt;script&gt;')
        expect(html).toContain('Ana &amp; Bruno')
        expect(html).not.toContain('Ranking <script>')
    })
})
