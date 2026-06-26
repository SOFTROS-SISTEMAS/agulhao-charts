# @softros/agulhao-charts-node

Adaptador Node.js do Agulhão Charts.

Ele usa o pacote `core` para traduzir a definição comum e gera saídas prontas para APIs, relatórios e renderização server-side.

## Instalação

```bash
npm install @softros/agulhao-charts-node
```

## Gerar HTML

```ts
import { gerarHtmlGrafico } from '@softros/agulhao-charts-node'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

const grafico: DefinicaoGrafico = {
    tipo: 'barra',
    titulo: 'Vendas por dia',
    dataset: {
        linhas: [
            { dia: 'Seg', valor: 120 },
            { dia: 'Ter', valor: 200 },
        ],
    },
    mapeamento: {
        eixoX: 'dia',
        eixoY: 'valor',
    },
}

const html = gerarHtmlGrafico(grafico, {
    largura: 800,
    altura: 600,
    tituloDocumento: 'Gráfico de vendas',
})
```

As opções de gráfico são as mesmas do pacote `core`, incluindo `gauge`, `ranking`, cores por série e cores por fatia de pizza.

Exemplo de cor por série:

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'linha',
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

```ts
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

```ts
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
        },
    },
}
```

## Mapa padrão do Brasil

Para gráficos `tipo: 'mapa'` com `opcoes.mapa.nome: 'BR'`, o pacote Node registra automaticamente o GeoJSON padrão dos estados brasileiros fornecido pelo `core`. Isso permite gerar HTML, SVG e PNG sem buscar o mapa em tempo de execução.

```ts
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

const imagem = await gerarImagemGraficoPngBase64(graficoMapa)
```

## Gerar SVG em base64

Disponível para gráficos renderizados por ECharts. Para `ranking`, use `gerarHtmlGrafico` ou `gerarImagemHtmlGraficoPngBase64`, porque o ranking é mantido como HTML/CSS.

```ts
import { gerarImagemGraficoBase64 } from '@softros/agulhao-charts-node'

const imagem = gerarImagemGraficoBase64(grafico, {
    largura: 800,
    altura: 600,
})

console.log(imagem.mimeType) // image/svg+xml
console.log(imagem.base64)
console.log(imagem.dataUri)
```

Para responder uma API com a imagem:

```ts
res.type(imagem.mimeType).send(Buffer.from(imagem.base64, 'base64'))
```

## Gerar PNG em base64

```ts
import { gerarImagemGraficoPngBase64 } from '@softros/agulhao-charts-node'

const imagem = await gerarImagemGraficoPngBase64(grafico, {
    largura: 800,
    altura: 600,
})

res.type(imagem.mimeType).send(imagem.buffer)
```

Também pode retornar via JSON:

```ts
res.json({
    imagem: imagem.dataUri,
})
```

## Gerar PNG a partir do HTML

Para renderizar exatamente o HTML produzido por `gerarHtmlGrafico`, incluindo o layout do `ranking`, use:

```ts
import { gerarImagemHtmlGraficoPngBase64 } from '@softros/agulhao-charts-node'

const imagem = await gerarImagemHtmlGraficoPngBase64(graficoRanking, {
    largura: 800,
    altura: 600,
})

res.type(imagem.mimeType).send(imagem.buffer)
```

No ambiente de execução, instale o Chromium usado pelo Playwright:

```bash
npx playwright install chromium
```

Em containers Linux, normalmente use:

```bash
npx playwright install --with-deps chromium
```

## API

### gerarHtmlGrafico

```ts
function gerarHtmlGrafico(grafico: DefinicaoGrafico, opcoes?: OpcoesHtmlGrafico): string
```

### gerarImagemGraficoBase64

```ts
function gerarImagemGraficoBase64(grafico: DefinicaoGrafico, opcoes?: OpcoesImagemGrafico): ImagemGraficoSvgBase64
```

Retorna SVG em base64.

Graficos `ranking` nao sao gerados em SVG.

### gerarImagemGraficoPngBase64

```ts
function gerarImagemGraficoPngBase64(grafico: DefinicaoGrafico, opcoes?: OpcoesImagemGrafico): Promise<ImagemGraficoPngBase64>
```

Retorna PNG em base64 e também o `Buffer`.

### gerarImagemHtmlGraficoPngBase64

```ts
function gerarImagemHtmlGraficoPngBase64(grafico: DefinicaoGrafico, opcoes?: OpcoesImagemHtmlGrafico): Promise<ImagemGraficoPngBase64>
```

Renderiza o HTML de `gerarHtmlGrafico` em Chromium via Playwright e retorna PNG em base64.
