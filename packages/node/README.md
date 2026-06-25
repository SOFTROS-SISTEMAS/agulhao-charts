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

## Gerar SVG em base64

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

### gerarImagemGraficoPngBase64

```ts
function gerarImagemGraficoPngBase64(grafico: DefinicaoGrafico, opcoes?: OpcoesImagemGrafico): Promise<ImagemGraficoPngBase64>
```

Retorna PNG em base64 e também o `Buffer`.
