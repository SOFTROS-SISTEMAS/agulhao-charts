# @softros/agulhao-charts-react

Componente React do Agulhão Charts.

Ele recebe uma `DefinicaoGrafico`, usa o `core` para gerar a option do ECharts e renderiza com `echarts-for-react`.

## Instalação

```bash
npm install @softros/agulhao-charts-react
```

## Uso

```tsx
import { AgulhaoChart } from '@softros/agulhao-charts-react'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

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

O componente aceita qualquer `DefinicaoGrafico` suportada pelo pacote `core`, incluindo `barra`, `linha`, `area`, `pizza`, `gauge` e `mapa`.

Exemplo com cor por série:

```tsx
const graficoComCor: DefinicaoGrafico = {
    tipo: 'linha',
    titulo: 'Vendas por dia',
    dataset: {
        linhas: [
            { dia: 'Seg', valor: 150 },
            { dia: 'Ter', valor: 230 },
        ],
    },
    mapeamento: {
        eixoX: 'dia',
        eixoY: 'valor',
    },
    opcoes: {
        serie: {
            nome: 'Vendas',
            cor: [
                { nome: 'Vendas', cor: '#0f766e' },
            ],
        },
    },
}
```

Exemplo de gauge:

```tsx
const graficoGauge: DefinicaoGrafico = {
    tipo: 'gauge',
    titulo: 'Meta atingida',
    dataset: {
        linhas: [
            { indicador: 'Conversão', percentual: 72 },
        ],
    },
    mapeamento: {
        rotulo: 'indicador',
        valor: 'percentual',
    },
    opcoes: {
        mostrarLegenda: false,
        serie: {
            nome: 'Performance',
            cor: [
                { nome: 'Performance', cor: '#0f766e' },
            ],
        },
        gauge: {
            minimo: 0,
            maximo: 100,
            mostrarProgresso: true,
        },
    },
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
