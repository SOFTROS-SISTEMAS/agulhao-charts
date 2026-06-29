import { criarDadosRanking } from './buildRanking.js'
import type { ItemRankingGrafico } from './buildRanking.js'
import type { DefinicaoGrafico } from './types.js'

export const CSS_RANKING_GRAFICO = `.agulhao-ranking {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow: auto;
    padding: 20px;
    color: #111827;
    font-family: Arial, sans-serif;
    background: #ffffff;
}

.agulhao-ranking-cabecalho {
    flex: 0 0 auto;
}

.agulhao-ranking-titulo {
    margin: 0;
    font-size: 20px;
    line-height: 1.25;
    font-weight: 700;
}

.agulhao-ranking-subtitulo {
    margin: 4px 0 0;
    color: #6b7280;
    font-size: 13px;
    line-height: 1.35;
}

.agulhao-ranking-podio {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: end;
    gap: 10px;
    min-height: 140px;
}

.agulhao-ranking-degrau {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 0;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
}

.agulhao-ranking-degrau-1 {
    min-height: 132px;
    order: 2;
}

.agulhao-ranking-degrau-2 {
    min-height: 108px;
    order: 1;
}

.agulhao-ranking-degrau-3 {
    min-height: 88px;
    order: 3;
}

.agulhao-ranking-medalha,
.agulhao-ranking-posicao {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
}

.agulhao-ranking-medalha-1,
.agulhao-ranking-posicao-1 {
    background: #f2b705;
}

.agulhao-ranking-medalha-2,
.agulhao-ranking-posicao-2 {
    background: #9ca3af;
}

.agulhao-ranking-medalha-3,
.agulhao-ranking-posicao-3 {
    background: #c47a3c;
}

.agulhao-ranking-medalha:not(.agulhao-ranking-medalha-1):not(.agulhao-ranking-medalha-2):not(.agulhao-ranking-medalha-3),
.agulhao-ranking-posicao:not(.agulhao-ranking-posicao-1):not(.agulhao-ranking-posicao-2):not(.agulhao-ranking-posicao-3) {
    background: #212121;
}

.agulhao-ranking-rotulo-podio {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
}

.agulhao-ranking-valor-podio {
    color: #374151;
    font-size: 12px;
    font-weight: 700;
}

.agulhao-ranking-lista {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
    margin-top: 16px;
}

.agulhao-ranking-item {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
}

.agulhao-ranking-conteudo {
    flex: 1 1 auto;
    min-width: 0;
}

.agulhao-ranking-linha {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    min-width: 0;
    margin-bottom: 4px;
    font-size: 13px;
}

.agulhao-ranking-rotulo {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
}

.agulhao-ranking-valor {
    flex: 0 0 auto;
}

.agulhao-ranking-trilho {
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: #e5e7eb;
}

.agulhao-ranking-barra {
    height: 100%;
    border-radius: 999px;
}`

export function criarHtmlRankingGrafico(grafico: DefinicaoGrafico): string {
    const ranking = criarDadosRanking(grafico)
    const maximo = ranking.maximo || 1
    const podio = ordenarPodio(ranking.itens.slice(0, 3))
    const htmlCabecalho =
        ranking.titulo || ranking.subtitulo
            ? `<header class="agulhao-ranking-cabecalho">${ranking.titulo ? `<h3 class="agulhao-ranking-titulo">${escaparHtml(ranking.titulo)}</h3>` : ''}${
                  ranking.subtitulo ? `<p class="agulhao-ranking-subtitulo">${escaparHtml(ranking.subtitulo)}</p>` : ''
              }</header>`
            : ''
    const htmlPodio =
        ranking.mostrarPodio && podio.length > 0
            ? `<div class="agulhao-ranking-podio">${podio
                  .map(
                      (item) => `<div class="agulhao-ranking-degrau agulhao-ranking-degrau-${item.posicao}">
                <span class="agulhao-ranking-medalha agulhao-ranking-medalha-${item.posicao}">${item.posicao}</span>
                <strong class="agulhao-ranking-rotulo-podio">${escaparHtml(item.rotulo)}</strong>
                <span class="agulhao-ranking-valor-podio">${escaparHtml(item.valorFormatado)}</span>
            </div>`,
                  )
                  .join('')}</div>`
            : ''
    const htmlItens = ranking.itens
        .map((item) => {
            const larguraBarra = Math.max(4, (item.valor / maximo) * 100)
            const cor = escaparHtml(item.cor ?? obterCorPosicao(item.posicao))

            return `<li class="agulhao-ranking-item">
                <span class="agulhao-ranking-posicao agulhao-ranking-posicao-${item.posicao}">${item.posicao}</span>
                <div class="agulhao-ranking-conteudo">
                    <div class="agulhao-ranking-linha">
                        <span class="agulhao-ranking-rotulo">${escaparHtml(item.rotulo)}</span>
                        <strong class="agulhao-ranking-valor">${escaparHtml(item.valorFormatado)}</strong>
                    </div>
                    <div class="agulhao-ranking-trilho"><div class="agulhao-ranking-barra" style="width: ${larguraBarra}%; background: ${cor};"></div></div>
                </div>
            </li>`
        })
        .join('')

    return `${htmlCabecalho}${htmlPodio}<ol class="agulhao-ranking-lista">${htmlItens}</ol>`
}

function ordenarPodio(itens: ItemRankingGrafico[]): ItemRankingGrafico[] {
    const primeiro = itens.find((item) => item.posicao === 1)
    const segundo = itens.find((item) => item.posicao === 2)
    const terceiro = itens.find((item) => item.posicao === 3)

    return [segundo, primeiro, terceiro].filter((item): item is ItemRankingGrafico => Boolean(item))
}

function obterCorPosicao(posicao: number): string {
    switch (posicao) {
        case 1:
            return '#f2b705'
        case 2:
            return '#9ca3af'
        case 3:
            return '#c47a3c'
        default:
            return '#212121'
    }
}

function escaparHtml(valor: string): string {
    return valor.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}
