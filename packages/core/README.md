# @softros/agulhao-charts-core

Pacote base do Agulhão Charts.

Ele contém os tipos da definição comum de gráfico. O coração do pacote é o objeto `DefinicaoGrafico`, usado pelos pacotes `core`, `node` e `react`.

## Instalação

```bash
npm install @softros/agulhao-charts-core
```

## DefinicaoGrafico

```ts
import type { DefinicaoGrafico } from '@softros/agulhao-charts-core'

const grafico: DefinicaoGrafico = {
    tipo: 'linha',
    titulo: 'Receita e custo',
    dataset: {
        colunas: [
            { nome: 'mes', tipo: 'texto', rotulo: 'Mês' },
            { nome: 'receita', tipo: 'numero', rotulo: 'Receita' },
            { nome: 'custo', tipo: 'numero', rotulo: 'Custo' },
        ],
        linhas: [
            { mes: 'Jan', receita: 42000, custo: 24000 },
            { mes: 'Fev', receita: 46000, custo: 27000 },
            { mes: 'Mar', receita: 53000, custo: 31000 },
        ],
    },
    mapeamento: {
        eixoX: 'mes',
        eixoY: ['receita', 'custo'],
    },
    opcoes: {
        subtitulo: 'Dados fictícios',
        mostrarLegenda: true,
        mostrarTooltip: true,
        moeda: 'BRL',
        titulo: {
            esquerda: 'center',
        },
        legenda: {
            orientacao: 'horizontal',
        },
        serie: {
            cor: [
                { nome: 'Receita', cor: '#0f766e' },
                { nome: 'Custo', cor: '#dc2626' },
            ],
        },
    },
}
```

## Exportações

```ts
export { criarOpcaoECharts }
export { obterGeoJsonMapaBrasil, obterNomeMapa }

export type {
    ColunaGrafico,
    CorSerieGrafico,
    DatasetGrafico,
    DefinicaoGrafico,
    LinhaGrafico,
    MapeamentoGrafico,
    OpcoesGrafico,
    TipoColunaGrafico,
    TipoGrafico,
    ValorGrafico,
}
```

## Tipos

```ts
type TipoGrafico = 'barra' | 'linha' | 'area' | 'pizza' | 'gauge' | 'mapa'
type TipoColunaGrafico = 'texto' | 'numero' | 'data' | 'dataHora' | 'booleano'
type ValorGrafico = string | number | boolean | Date | null
type LinhaGrafico = Record<string, ValorGrafico>
```

```ts
type ColunaGrafico = {
    nome: string
    tipo: TipoColunaGrafico
    rotulo?: string
}

type DatasetGrafico = {
    colunas?: ColunaGrafico[]
    linhas: LinhaGrafico[]
}
```

`dataset.colunas` é opcional. Quando informado, o `rotulo` da coluna é usado como nome amigável da série em gráficos com eixo.

```ts
type MapeamentoGrafico = {
    eixoX?: string
    eixoY?: string | string[]
    serie?: string
    rotulo?: string
    valor?: string
    cor?: string
}
```

```ts
type CorSerieGrafico = {
    nome: string
    cor: string
}
```

```ts
type OpcoesGrafico = {
    empilhado?: boolean
    mostrarLegenda?: boolean
    mostrarTooltip?: boolean
    moeda?: string
    subtitulo?: string
    titulo?: {
        esquerda?: string
    }
    legenda?: {
        orientacao?: 'horizontal' | 'vertical'
        esquerda?: string
    }
    serie?: {
        nome?: string
        cor?: CorSerieGrafico[]
    }
    pizza?: {
        raio?: string
        destacarAoPassarMouse?: boolean
    }
    gauge?: {
        minimo?: number
        maximo?: number
        mostrarProgresso?: boolean
    }
    mapa?: {
        nome?: string
        permitirZoom?: boolean
        mostrarRotuloAoDestacar?: boolean
        tamanho?: string
        centro?: {
            x?: string
            y?: string
        }
        escalaVisual?: {
            minimo?: number
            maximo?: number
            cores?: string[]
            textoSuperior?: string
            textoInferior?: string
            calculavel?: boolean
            esquerda?: string
        }
    }
}
```

```ts
type DefinicaoGrafico = {
    tipo: TipoGrafico
    titulo?: string
    dataset: DatasetGrafico
    mapeamento: MapeamentoGrafico
    opcoes?: OpcoesGrafico
}
```

## Tipos de gráfico

### linha

Gráfico cartesiano de linha.

Mapeamentos obrigatórios:

- `mapeamento.eixoX`
- `mapeamento.eixoY`

```ts
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
```

### barra

Gráfico cartesiano de barras.

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'barra',
    titulo: 'Pedidos por dia',
    dataset: {
        linhas: [
            { dia: 'Seg', pedidos: 120 },
            { dia: 'Ter', pedidos: 200 },
            { dia: 'Qua', pedidos: 150 },
        ],
    },
    mapeamento: {
        eixoX: 'dia',
        eixoY: 'pedidos',
    },
}
```

### area

Gráfico cartesiano de área.

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'area',
    titulo: 'Receita acumulada',
    dataset: {
        linhas: [
            { mes: 'Jan', receita: 32000 },
            { mes: 'Fev', receita: 41000 },
            { mes: 'Mar', receita: 52000 },
        ],
    },
    mapeamento: {
        eixoX: 'mes',
        eixoY: 'receita',
    },
    opcoes: {
        moeda: 'BRL',
    },
}
```

### pizza

Gráfico de pizza.

Mapeamentos obrigatórios:

- `mapeamento.rotulo`
- `mapeamento.valor`

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'pizza',
    titulo: 'Origem dos acessos',
    dataset: {
        linhas: [
            { origem: 'Busca', acessos: 1048 },
            { origem: 'Direto', acessos: 735 },
            { origem: 'E-mail', acessos: 580 },
        ],
    },
    mapeamento: {
        rotulo: 'origem',
        valor: 'acessos',
    },
    opcoes: {
        serie: {
            nome: 'Acessos por origem',
        },
        pizza: {
            raio: '54%',
            destacarAoPassarMouse: true,
        },
    },
}
```

### gauge

Gráfico de marcador do tipo gauge.

Mapeamento obrigatório:

- `mapeamento.valor`

Mapeamento opcional:

- `mapeamento.rotulo`

```ts
const grafico: DefinicaoGrafico = {
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

### mapa

Gráfico de mapa. O core monta a definição do gráfico, mas quem renderiza precisa registrar o GeoJSON no ECharts antes de usar a option.

Mapeamentos obrigatórios:

- `mapeamento.rotulo`
- `mapeamento.valor`

Exemplo para mapa do Brasil por estados:

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'mapa',
    titulo: 'Indicador por estado',
    dataset: {
        linhas: [
            { estado: 'Acre', valor: 894 },
            { estado: 'Alagoas', valor: 3351 },
            { estado: 'Amazonas', valor: 4207 },
            { estado: 'Bahia', valor: 14931 },
            { estado: 'Ceará', valor: 9187 },
            { estado: 'Distrito Federal', valor: 3055 },
            { estado: 'Minas Gerais', valor: 21412 },
            { estado: 'Paraná', valor: 11516 },
            { estado: 'Rio de Janeiro', valor: 17463 },
            { estado: 'Rio Grande do Sul', valor: 11423 },
            { estado: 'Santa Catarina', valor: 7252 },
            { estado: 'São Paulo', valor: 46649 },
        ],
    },
    mapeamento: {
        rotulo: 'estado',
        valor: 'valor',
    },
    opcoes: {
        mostrarLegenda: false,
        serie: {
            nome: 'Indicador',
        },
        mapa: {
            nome: 'BR',
            permitirZoom: true,
            mostrarRotuloAoDestacar: true,
            tamanho: '82%',
            centro: {
                x: '43%',
                y: '55%',
            },
            escalaVisual: {
                minimo: 0,
                maximo: 50000,
                cores: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
                textoSuperior: 'Maior',
                textoInferior: 'Menor',
                calculavel: true,
                esquerda: 'right',
            },
        },
    },
}
```

Registro do mapa no navegador:

```ts
const resposta = await fetch('https://code.highcharts.com/mapdata/countries/br/br-all.geo.json')
const geoJson = await resposta.json()

echarts.registerMap('BR', geoJson)
```

## Séries e agrupamento

### Uma série

Quando `mapeamento.eixoY` é uma string, o gráfico gera uma série.

```ts
mapeamento: {
    eixoX: 'mes',
    eixoY: 'receita',
}
```

### Múltiplas séries por campos

Quando `mapeamento.eixoY` é uma lista, cada campo vira uma série.

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'linha',
    dataset: {
        colunas: [
            { nome: 'receita', tipo: 'numero', rotulo: 'Receita' },
            { nome: 'custo', tipo: 'numero', rotulo: 'Custo' },
        ],
        linhas: [
            { mes: 'Jan', receita: 42000, custo: 24000 },
            { mes: 'Fev', receita: 46000, custo: 27000 },
        ],
    },
    mapeamento: {
        eixoX: 'mes',
        eixoY: ['receita', 'custo'],
    },
}
```

### Múltiplas séries por agrupamento

Quando `mapeamento.serie` é informado e `eixoY` tem apenas um campo, cada valor distinto de `mapeamento.serie` vira uma série.

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'barra',
    titulo: 'Pedidos por canal',
    dataset: {
        linhas: [
            { mes: 'Jan', canal: 'Loja', pedidos: 120 },
            { mes: 'Jan', canal: 'Online', pedidos: 180 },
            { mes: 'Fev', canal: 'Loja', pedidos: 140 },
            { mes: 'Fev', canal: 'Online', pedidos: 210 },
        ],
    },
    mapeamento: {
        eixoX: 'mes',
        eixoY: 'pedidos',
        serie: 'canal',
    },
}
```

### Valores repetidos no eixo X

Em gráficos com eixo, os valores de `eixoX` são deduplicados preservando a ordem de aparição. Quando há mais de uma linha para a mesma categoria, os valores numéricos são somados.

```ts
dataset: {
    linhas: [
        { mes: 'Jan', pedidos: 120 },
        { mes: 'Jan', pedidos: 80 },
    ],
},
mapeamento: {
    eixoX: 'mes',
    eixoY: 'pedidos',
}
```

O ponto de `Jan` será `200`.

## Cores

### Cor de séries

Use `opcoes.serie.cor` sempre como lista de objetos `{ nome, cor }`.

```ts
opcoes: {
    serie: {
        cor: [
            { nome: 'Receita', cor: '#0f766e' },
            { nome: 'Custo', cor: '#dc2626' },
        ],
    },
}
```

O `nome` é comparado com:

- o nome exibido da série, incluindo `dataset.colunas[].rotulo`
- o nome técnico do campo usado em `eixoY`
- o nome informado em `opcoes.serie.nome`
- o valor do campo usado em `mapeamento.serie`

Para série única, continue usando lista:

```ts
opcoes: {
    serie: {
        nome: 'Vendas',
        cor: [
            { nome: 'Vendas', cor: '#0f766e' },
        ],
    },
}
```

As cores devem ser informadas em hexadecimal, RGB, RGBA ou qualquer formato de cor aceito pelo navegador.

### Cor de pizza

Em gráficos de pizza, a cor de cada fatia pode vir de uma coluna do dataset. Informe o nome da coluna em `mapeamento.cor`.

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'pizza',
    titulo: 'Origem dos acessos',
    dataset: {
        linhas: [
            { origem: 'Busca', acessos: 1048, cor: '#0f766e' },
            { origem: 'Direto', acessos: 735, cor: '#2563eb' },
        ],
    },
    mapeamento: {
        rotulo: 'origem',
        valor: 'acessos',
        cor: 'cor',
    },
}
```

### Cor de mapa

Em gráficos de mapa, também é possível informar a cor diretamente por região usando uma coluna do dataset e `mapeamento.cor`.

```ts
const grafico: DefinicaoGrafico = {
    tipo: 'mapa',
    dataset: {
        linhas: [
            { estado: 'São Paulo', valor: 46649, cor: '#313695' },
            { estado: 'Minas Gerais', valor: 21412, cor: '#4575b4' },
        ],
    },
    mapeamento: {
        rotulo: 'estado',
        valor: 'valor',
        cor: 'cor',
    },
    opcoes: {
        mapa: {
            nome: 'BR',
            tamanho: '82%',
        },
    },
}
```

## Opções comuns

### Título e subtítulo

```ts
opcoes: {
    subtitulo: 'Dados fictícios',
    titulo: {
        esquerda: 'center',
    },
}
```

Campos usados:

- `grafico.titulo`: título principal
- `opcoes.subtitulo`: subtítulo
- `opcoes.titulo.esquerda`: posição horizontal do título

### Tooltip

O tooltip vem habilitado por padrão.

```ts
opcoes: {
    mostrarTooltip: false,
}
```

Quando `mostrarTooltip` não é informado, o tooltip fica ativo.

### Legenda

A legenda vem habilitada por padrão.

```ts
opcoes: {
    mostrarLegenda: false,
}
```

Configurações disponíveis:

```ts
opcoes: {
    legenda: {
        orientacao: 'vertical',
        esquerda: 'left',
    },
}
```

Em gráficos com eixo, a legenda fica no rodapé por padrão para evitar sobreposição com o título.

### Moeda

`opcoes.moeda` define o sufixo de moeda nos valores do eixo Y em gráficos com eixo.

```ts
opcoes: {
    moeda: 'BRL',
}
```

## Opções específicas

### opcoes.empilhado

Disponível para gráficos com eixo.

```ts
opcoes: {
    empilhado: true,
}
```

Quando ativo, as séries do gráfico são empilhadas.

### opcoes.serie.nome

Define o nome da série em gráficos `pizza` e `gauge`. Em gráficos com eixo sem agrupamento, o nome da série vem do rótulo da coluna ou do nome técnico do campo.

```ts
opcoes: {
    serie: {
        nome: 'Performance',
    },
}
```

### opcoes.pizza.raio

Define o raio visual da pizza.

```ts
opcoes: {
    pizza: {
        raio: '50%',
    },
}
```

Valor padrão: `'65%'`.

### opcoes.pizza.destacarAoPassarMouse

Controla o efeito de destaque no hover da pizza.

```ts
opcoes: {
    pizza: {
        destacarAoPassarMouse: false,
    },
}
```

Por padrão, o destaque fica ativo.

### opcoes.gauge

```ts
opcoes: {
    gauge: {
        minimo: 0,
        maximo: 100,
        mostrarProgresso: true,
    },
}
```

Campos disponíveis:

- `minimo`: menor valor do gauge
- `maximo`: maior valor do gauge
- `mostrarProgresso`: exibe o progresso preenchido

## Validação e conversão de valores

O core valida:

- `dataset.linhas` deve ser um array
- `pizza` exige `mapeamento.rotulo` e `mapeamento.valor`
- `gauge` exige `mapeamento.valor`
- `mapa` exige `mapeamento.rotulo` e `mapeamento.valor`
- gráficos com eixo exigem `mapeamento.eixoX` e `mapeamento.eixoY`
- campos mapeados devem existir na primeira linha do dataset, quando houver linhas

Conversão numérica:

- `number` é usado diretamente
- `string` é convertida com `Number(valor)` quando possível
- valores não numéricos entram como `0`

Normalização textual:

- `Date` vira `toISOString()`
- `null` vira string vazia
- demais valores viram `String(valor)`

## Exemplos locais

Há uma página HTML com exemplos completos em:

```text
exemplos/graficos-base.html
```
