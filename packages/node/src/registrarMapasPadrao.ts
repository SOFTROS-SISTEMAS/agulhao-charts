import { obterGeoJsonMapaBrasil, obterNomeMapa } from '@softros/agulhao-charts-core'
import type * as ECharts from 'echarts/types/dist/echarts'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

type EChartsComMapa = Pick<typeof ECharts, 'registerMap'>
type GeoJsonRegistravel = Parameters<typeof ECharts.registerMap>[1]

export function registrarMapasPadrao(echarts: EChartsComMapa, grafico: DefinicaoGrafico): void {
    if (obterNomeMapa(grafico) !== 'BR') {
        return
    }

    echarts.registerMap('BR', obterGeoJsonMapaBrasil() as GeoJsonRegistravel)
}
