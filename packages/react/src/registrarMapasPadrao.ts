import echarts = require('echarts')
import { obterGeoJsonMapaBrasil, obterNomeMapa } from '@softros/agulhao-charts-core'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

type GeoJsonRegistravel = Parameters<typeof echarts.registerMap>[1]
type EChartsComRegistroDeMapa = {
    registerMap?: (nome: string, geoJson: GeoJsonRegistravel) => void
}

export function registrarMapasPadrao(grafico: DefinicaoGrafico, echartsCustomizado?: unknown): void {
    if (obterNomeMapa(grafico) !== 'BR') {
        return
    }

    const geoJson = obterGeoJsonMapaBrasil() as GeoJsonRegistravel
    const registradorCustomizado = (echartsCustomizado as EChartsComRegistroDeMapa | undefined)?.registerMap

    if (registradorCustomizado) {
        registradorCustomizado('BR', geoJson)
        return
    }

    echarts.registerMap('BR', geoJson)
}
