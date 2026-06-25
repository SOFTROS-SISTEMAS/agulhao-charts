import brasilEstadosGeoJson from './maps/brasil-estados.geo.json' with { type: 'json' }
import type { DefinicaoGrafico } from './types.js'

export function obterNomeMapa(grafico: DefinicaoGrafico): string | undefined {
    if (grafico.tipo !== 'mapa') {
        return undefined
    }

    return grafico.opcoes?.mapa?.nome ?? 'BR'
}

export function obterGeoJsonMapaBrasil(): unknown {
    return brasilEstadosGeoJson
}
