# AGENTS.md — Agulhão Charts

Guia para agentes de LLM que precisam montar gráficos ECharts/React a partir deste monorepo.

## Visão geral do monorepo

- `packages/core` — define o tipo `DefinicaoGrafico` e a função `criarOpcaoECharts`, que traduz essa definição para um `EChartsOption` puro (sem React, sem DOM).
- `packages/react` — expõe o componente `AgulhaoChart`, que recebe um `DefinicaoGrafico`, chama `criarOpcaoECharts` do core e passa o resultado para `echarts-for-react` (`ReactECharts`).
- `packages/node` — usa o core em contexto Node (ex.: geração de imagens/relatórios no servidor).

**Regra de ouro:** nunca monte um `EChartsOption` manualmente nem passe `option` direto para `ReactECharts`. Monte um `DefinicaoGrafico` e deixe o `core` gerar a option.

## Montando `ReactECharts` com o core

O componente React (`packages/react/src/chart.tsx`) faz exatamente isto:

```tsx
import ReactECharts from 'echarts-for-react'
import { criarOpcaoECharts } from '@softros/agulhao-charts-core'
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

function MeuGrafico({ grafico }: { grafico: DefinicaoGrafico }) {
    const option = criarOpcaoECharts(grafico)

    return <ReactECharts option={option} style={{ width: '100%', height: 400 }} />
}
```

Se o `DefinicaoGrafico.tipo === 'mapa'`, é necessário registrar o GeoJSON no ECharts **antes** de renderizar (veja `obterGeoJsonMapaBrasil`/`obterNomeMapa` do core, ou `registrarMapasPadrao` do pacote react).

Se `tipo === 'ranking'`, **não** use `criarOpcaoECharts`/`ReactECharts` — ranking não é um gráfico ECharts. Use `criarDadosRanking` (dados) ou `criarHtmlRankingGrafico` (HTML pronto) do core.

### Usando o componente já pronto

Prefira usar `AgulhaoChart` de `@softros/agulhao-charts-react` em vez de remontar isso manualmente — ele já cuida do registro de mapas e do caso `ranking`:

```tsx
import { AgulhaoChart } from '@softros/agulhao-charts-react'

<AgulhaoChart grafico={grafico} largura="100%" altura={400} />
```

## Como o agente deve montar o objeto `DefinicaoGrafico`

```ts
type DefinicaoGrafico = {
    tipo: 'barra' | 'linha' | 'area' | 'pizza' | 'gauge' | 'mapa' | 'ranking'
    titulo?: string
    dataset: { colunas?: ColunaGrafico[]; linhas: LinhaGrafico[] }
    mapeamento: MapeamentoGrafico
    opcoes?: OpcoesGrafico
}
```

Passos para construir um a partir dos dados do usuário:

1. **Escolha `tipo`** de acordo com a intenção (comparar ao longo do tempo → `linha`/`area`/`barra`; proporção de partes → `pizza`; progresso contra meta → `gauge`; distribuição geográfica → `mapa`; "top N" ordenado → `ranking`).
2. **Monte `dataset.linhas`**: um array de objetos simples (`Record<string, string | number | boolean | Date | null>`), uma linha por registro. `dataset.colunas` é opcional e só serve para dar `rotulo` (nome amigável) a um campo — não é obrigatório listar todas as colunas.
3. **Monte `mapeamento`** de acordo com o tipo:
   - `linha` / `area` / `barra`: exigem `eixoX` (nome do campo categórico) e `eixoY` (nome do campo numérico, ou lista de nomes para múltiplas séries). Use `serie` (nome de um campo) em vez de lista em `eixoY` quando as séries vêm de um agrupamento de linhas (ex.: uma linha por mês+canal) em vez de colunas separadas.
   - `pizza`: exigem `rotulo` (campo com o nome da fatia) e `valor` (campo numérico). `cor` é opcional, aponta para um campo com cor por linha.
   - `gauge`: exige `valor` (campo numérico); `rotulo` é opcional.
   - `mapa`: exigem `rotulo` (campo com o nome da região, deve casar com os nomes do GeoJSON) e `valor` (campo numérico). `cor` é opcional.
   - `ranking`: mesma lógica de `pizza` (`rotulo` + `valor`).
4. **Monte `opcoes` apenas com o que for necessário** — todos os campos são opcionais e têm defaults sensatos (tooltip e legenda ligados, pizza com raio `65%`, etc.). Não repita defaults. Use `opcoes.rotulo` quando precisar customizar o label de cada ponto/fatia/região (formato, fonte, `labelLine` em pizza) — é genérico para todos os tipos, veja o [README do core](packages/core/README.md#opcoesrotulo).
5. **Cores de série**: sempre como lista `{ nome, cor }[]` em `opcoes.serie.cor`, nunca como string única ou array de cores "na ordem". O `nome` deve casar com o rótulo da série (rótulo da coluna, nome do campo, `opcoes.serie.nome`, ou valor do campo de `mapeamento.serie`).

### Exemplo mínimo (linha)

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'linha',
    titulo: 'Vendas por dia',
    dataset: {
        linhas: [
            { dia: 'Seg', valor: 150 },
            { dia: 'Ter', valor: 230 },
        ],
    },
    mapeamento: { eixoX: 'dia', eixoY: 'valor' },
}
```

### Exemplo com múltiplas séries por agrupamento

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'barra',
    dataset: {
        linhas: [
            { mes: 'Jan', canal: 'Loja', pedidos: 120 },
            { mes: 'Jan', canal: 'Online', pedidos: 180 },
        ],
    },
    mapeamento: { eixoX: 'mes', eixoY: 'pedidos', serie: 'canal' },
}
```

## Validações que o core já faz (não precisa reimplementar)

- `dataset.linhas` precisa ser array.
- Campos mapeados precisam existir na primeira linha do dataset (quando houver linhas).
- `pizza`/`ranking` exigem `rotulo` + `valor`; `gauge` exige `valor`; `mapa` exige `rotulo` + `valor`; gráficos de eixo exigem `eixoX` + `eixoY`.
- Valores não numéricos em campos numéricos são convertidos com `Number(valor)`, caindo para `0` se inválido.
- Categorias repetidas em `eixoX` são deduplicadas e os valores numéricos são somados.

Se a validação falhar, `criarOpcaoECharts` lança uma `Error` — trate isso como um erro de dados do usuário, não de código.

## Convertendo um gráfico ECharts existente para `AgulhaoChart`

Quando o usuário colar um trecho de código que já monta `option`/`dados` de ECharts (ou um objeto `EChartsOption` puro) e pedir para "passar para o AgulhaoChart", siga este roteiro:

1. **Identifique o tipo da série** (`series.type` ou `series[0].type`) e mapeie para `DefinicaoGrafico.tipo`:
   - `pie` → `pizza`
   - `bar` → `barra`
   - `line` (sem `areaStyle`) → `linha`
   - `line` com `areaStyle` → `area`
   - `gauge` → `gauge`
   - `map` → `mapa`
2. **Reconstrua `dataset.linhas` a partir de `series.data`**: cada item `{ name, value, itemStyle: { color } }` (ou equivalente em eixo) vira uma linha de objeto simples, com um campo para o nome/categoria, um para o valor e, se houver cor por item, um campo para a cor. Escolha nomes de campo descritivos (ex.: `status`, `quantidade`, `cor`), não precisa copiar nomes do código original.
3. **Monte `mapeamento`** apontando para os nomes de campo escolhidos no passo 2 (`rotulo`/`valor`/`cor` para pizza/mapa/ranking; `eixoX`/`eixoY`/`serie` para gráficos de eixo).
4. **Traduza as opções visuais** do `option` original para `opcoes`:
   - `title.text/subtext/left` → `grafico.titulo` / `opcoes.subtitulo` / `opcoes.titulo.esquerda`
   - `legend` → `opcoes.mostrarLegenda` / `opcoes.legenda`
   - `tooltip` → `opcoes.mostrarTooltip` (o `trigger` já é automático por tipo de gráfico, não precisa mapear)
   - `series.name` → `opcoes.serie.nome`
   - `series.radius` (pizza) → `opcoes.pizza.raio`
   - `series.itemStyle.color` fixo (não por item) → `opcoes.serie.cor` (lista `{ nome, cor }`)
   - `label` + `labelLine` (qualquer tipo) → `opcoes.rotulo` (ver tipo `RotuloGrafico` no [README do core](packages/core/README.md#opcoesrotulo)); `label.formatter` string vira `opcoes.rotulo.formato` direto, sem alteração
   - `min`/`max`/`progress` do gauge → `opcoes.gauge`
   - `visualMap`/`roam`/`map` → `opcoes.mapa`
5. **Descarte do `option` original** o que o core já decide automaticamente e não é configurável: `grid`, `xAxis`/`yAxis` (eixo com eixo categórico é sempre gerado a partir de `mapeamento.eixoX`), `emphasis.itemStyle` de pizza (já é o default do core).
6. **Aponte os gaps**: se algo do `option` original não tiver equivalente em `OpcoesGrafico` (ex.: uma propriedade bem específica do ECharts que o core não expõe), diga isso explicitamente ao usuário em vez de tentar forçar um encaixe — não invente campos em `opcoes` que não existem nos tipos do core. Se o gap for recorrente, ofereça estender o core (como foi feito para `opcoes.rotulo`) em vez de ignorar silenciosamente a propriedade.
7. **Entregue o JSX final** com `<AgulhaoChart grafico={...} />`, preservando `style`/`className` do componente `ReactECharts` original.

### Criando um gráfico do zero

Quando não houver um `option` de ECharts de referência, pule os passos 1–2 e vá direto para "Como o agente deve montar o objeto `DefinicaoGrafico`" (seção acima): escolha o `tipo` pela intenção do usuário, monte `dataset.linhas` a partir dos dados brutos (array de objetos, JSON, resposta de API, etc.) e siga os mesmos passos 3–4 para `mapeamento`/`opcoes`.

## Documentação de referência completa

O [README do core](packages/core/README.md) tem todos os tipos, exemplos de cada tipo de gráfico, regras de cor e normalização em detalhe. Consulte-o para casos além do básico (ex.: mapas, escala visual, gauge com progresso).
