# @softros-sistemas/agulhao-charts-core

Pacote base do Agulhão Charts.

Ele contém os tipos da definição comum de gráfico e a função que traduz essa definição para um objeto `EChartsOption`.

## Instalação

```bash
npm install @softros-sistemas/agulhao-charts-core
```

## Uso

```ts
import { criarOpcaoECharts } from '@softros-sistemas/agulhao-charts-core'
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

const option = criarOpcaoECharts(grafico)
```

Resultado parcial:

```ts
{
  xAxis: {
    type: 'category',
    data: ['Seg', 'Ter', 'Qua'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      type: 'line',
      data: [150, 230, 224],
    },
  ],
}
```

## Tipos de gráfico

```ts
type TipoGrafico = 'barra' | 'linha' | 'area' | 'pizza' | 'gauge'
```

Atualmente o builder cobre os tipos principais usados nos testes:

- `linha`
- `barra`
- `area`
- `pizza`

## API

### criarOpcaoECharts

```ts
function criarOpcaoECharts(grafico: DefinicaoGrafico): EChartsOption
```

Traduz a definição comum do Agulhão Charts para a estrutura esperada pelo ECharts.

## DefinicaoGrafico

```ts
type DefinicaoGrafico = {
    tipo: TipoGrafico
    titulo?: string
    dataset: {
        colunas?: ColunaGrafico[]
        linhas: LinhaGrafico[]
    }
    mapeamento: {
        eixoX?: string
        eixoY?: string | string[]
        serie?: string
        rotulo?: string
        valor?: string
    }
    opcoes?: OpcoesGrafico
}
```

Para gráficos com eixo, use `eixoX` e `eixoY`.

Para gráfico de pizza, use `rotulo` e `valor`.
