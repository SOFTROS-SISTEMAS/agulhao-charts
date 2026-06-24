# @softros-sistemas/agulhao-charts-react

Componente React do Agulhão Charts.

Ele recebe uma `DefinicaoGrafico`, usa o `core` para gerar a option do ECharts e renderiza com `echarts-for-react`.

## Instalação

```bash
npm install @softros-sistemas/agulhao-charts-react
```

## Uso

```tsx
import { AgulhaoChart } from '@softros-sistemas/agulhao-charts-react'
import type { DefinicaoGrafico } from '@softros-sistemas/agulhao-charts-core'

const grafico: DefinicaoGrafico = {
    tipo: 'linha',
    titulo: 'Vendas por dia',
    dataset: {
        linhas: [
            { dia: 'Seg', valor: 150 },
            { dia: 'Ter', valor: 230 },
            { dia: 'Qua', valor: 224 },
        ],
    },
    mapeamento: {
        eixoX: 'dia',
        eixoY: 'valor',
    },
}

export function MinhaTela() {
    return <AgulhaoChart grafico={grafico} largura="100%" altura={400} />
}
```

## Props

```ts
type AgulhaoChartProps = {
    grafico: DefinicaoGrafico
    largura?: number | string
    altura?: number | string
    className?: string
    style?: CSSProperties
    notMerge?: boolean
    lazyUpdate?: boolean
    onEvents?: Record<string, (params: unknown) => void>
}
```

## Eventos

`onEvents` é repassado para o `echarts-for-react`.

Exemplo:

```tsx
<AgulhaoChart
    grafico={grafico}
    onEvents={{
        click: (params) => {
            console.log(params)
        },
    }}
/>
```
