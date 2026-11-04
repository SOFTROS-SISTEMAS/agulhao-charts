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

O componente aceita qualquer `DefinicaoGrafico` suportada pelo pacote `core`, incluindo `barra`, `linha`, `area`, `pizza`, `gauge`, `mapa` e `ranking`.

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

Exemplo de ranking sem ECharts:

```tsx
const graficoRanking: DefinicaoGrafico = {
    tipo: 'ranking',
    titulo: 'Ranking de vendedores',
    dataset: {
        linhas: [
            { nome: 'Bruno', total: 240 },
            { nome: 'Carla', total: 180 },
            { nome: 'Ana', total: 120 },
        ],
    },
    mapeamento: {
        rotulo: 'nome',
        valor: 'total',
    },
    opcoes: {
        ranking: {
            limite: 10,
            mostrarPodio: true,
            mostrarTotal: true,
        },
    },
}
```

## Mapa padrão do Brasil

Para gráficos `tipo: 'mapa'` com `opcoes.mapa.nome: 'BR'`, o componente registra automaticamente o GeoJSON padrão dos estados brasileiros fornecido pelo `core`.

```tsx
const graficoMapa: DefinicaoGrafico = {
    tipo: 'mapa',
    titulo: 'Indicador por estado',
    dataset: {
        linhas: [
            { estado: 'São Paulo', valor: 46649 },
            { estado: 'Minas Gerais', valor: 21412 },
        ],
    },
    mapeamento: {
        rotulo: 'estado',
        valor: 'valor',
    },
    opcoes: {
        mostrarLegenda: false,
        mapa: {
            nome: 'BR',
            tamanho: '82%',
            centro: {
                x: '43%',
                y: '55%',
            },
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
    echarts?: unknown
}
```

| Prop | Tipo | Default | Descrição |
| --- | --- | --- | --- |
| `grafico` | `DefinicaoGrafico` | — (obrigatório) | Definição declarativa do gráfico. Quando `grafico.tipo !== 'ranking'`, é passada para `criarOpcaoECharts` (core) e o resultado vai para o `option` do `echarts-for-react`; quando `grafico.tipo === 'ranking'`, é passada para `criarHtmlRankingGrafico` e renderizada como HTML puro (sem ECharts). Trocar a referência de `grafico` entre renders recalcula a option/HTML. |
| `largura` | `number \| string` | `'100%'` | Largura do container. Um número é convertido para pixels (`400` → `'400px'`); uma string é usada como medida CSS literal (`'100%'`, `'50vw'`). |
| `altura` | `number \| string` | `400` | Altura do container, com a mesma conversão número→pixels de `largura`. |
| `className` | `string` | — | Classe CSS do elemento raiz. Para `tipo: 'ranking'`, é concatenada com a classe fixa `agulhao-ranking`; para os demais tipos, vai direto para o `className` do `echarts-for-react`. |
| `style` | `CSSProperties` | — | Estilos inline do container, mesclados com o `{ width, height }` calculado a partir de `largura`/`altura` (chaves explícitas em `style` sobrescrevem `width`/`height`). Aplicado ao elemento raiz mesmo em `tipo: 'ranking'`. |
| `notMerge` | `boolean` | `false` | Repassado direto para a prop `notMerge` do `echarts-for-react`: quando `true`, cada atualização substitui a option inteira em vez de fazer merge com a anterior. Sem efeito em `tipo: 'ranking'` (não há instância ECharts). |
| `lazyUpdate` | `boolean` | `false` | Repassado direto para a prop `lazyUpdate` do `echarts-for-react`: quando `true`, adia a atualização para o próximo frame. Sem efeito em `tipo: 'ranking'`. |
| `onEvents` | `Record<string, (params: unknown) => void>` | — | Mapa `nome do evento ECharts → handler`, repassado para a prop `onEvents` do `echarts-for-react` (ver [seção "Eventos"](#eventos)). Sem efeito em `tipo: 'ranking'`. |
| `echarts` | `unknown` | — | Instância customizada do módulo `echarts` (ex.: build com apenas os componentes necessários). É usada tanto no registro de mapas (`registrarMapasPadrao`, para `tipo: 'mapa'`) quanto repassada para a prop `echarts` do `echarts-for-react`. Sem efeito em `tipo: 'ranking'`. |

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
