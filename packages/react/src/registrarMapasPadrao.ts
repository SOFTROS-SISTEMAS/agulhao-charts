import echarts = require('echarts')
import { obterGeoJsonMapaBrasil, obterNomeMapa } from '@softros/agulhao-charts-core'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

type GeoJsonRegistravel = Parameters<typeof echarts.registerMap>[1]

export function registrarMapasPadrao(grafico: DefinicaoGrafico): void {
    if (obterNomeMapa(grafico) !== 'BR') {
        return
    }

    echarts.registerMap('BR', obterGeoJsonMapaBrasil() as GeoJsonRegistravel)
}

export { echarts }
