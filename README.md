# Agulhão Charts

Biblioteca de gráficos da SOFTROS para transformar uma definição comum de gráfico em opções ECharts, componentes React e saídas renderizáveis no Node.js.

O projeto é um monorepo com pacotes separados por responsabilidade:

- [Core](./packages/core/README.md): tipos, função `criarOpcaoECharts` e dados normalizados para ranking sem ECharts.
- [Node](./packages/node/README.md): geração de HTML, SVG em base64 e PNG em base64.
- [React](./packages/react/README.md): componente `AgulhaoChart`.

## Exemplos

- [Gráficos base](./exemplos/graficos-base.html): página HTML com exemplos dos principais tipos de gráfico.

## Pacotes

```bash
npm install @softros/agulhao-charts-core
npm install @softros/agulhao-charts-node
npm install @softros/agulhao-charts-react
```

## Desenvolvimento

Instale as dependências:

```bash
npm install
```

Rode os testes:

```bash
npm test
```

Compile todos os pacotes:

```bash
npm run build
```

## Publicação

A publicação é feita pelo workflow:

```text
.github/workflows/publish.yml
```

Ele roda build, testes e publica os pacotes nesta ordem:

```text
core -> node -> react
```

## Licença

Apache-2.0. Veja [LICENSE](./LICENSE) e [NOTICE](./NOTICE).
