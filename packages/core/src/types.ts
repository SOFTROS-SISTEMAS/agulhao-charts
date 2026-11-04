/**
 * Tipo de gráfico suportado pelo Agulhão Charts. Determina qual builder em
 * `buildEChartsOption.ts` é usado e quais campos de `MapeamentoGrafico` são
 * obrigatórios (ver `validarGrafico`).
 *
 * - `barra` / `linha` / `area`: gráficos cartesianos com eixo X/Y.
 * - `pizza`: proporção de partes de um todo.
 * - `gauge`: marcador de progresso contra um valor mínimo/máximo.
 * - `mapa`: distribuição geográfica sobre um GeoJSON registrado no ECharts.
 * - `ranking`: lista ordenada "top N". Não é um gráfico ECharts — ver
 *   `criarDadosRanking`/`criarHtmlRankingGrafico`, não `criarOpcaoECharts`.
 */
export type TipoGrafico = 'barra' | 'linha' | 'area' | 'pizza' | 'gauge' | 'mapa' | 'ranking'

/**
 * Tipo declarado de uma coluna em `DatasetGrafico.colunas`. É apenas
 * metadado (usado hoje só para dar contexto/rótulo à coluna) — o core não
 * valida nem converte valores com base nesse tipo; a conversão numérica e a
 * normalização textual (ver `normalizacoes.ts`) são feitas de forma
 * best-effort em cima do valor bruto, independente do que está aqui.
 */
export type TipoColunaGrafico = 'texto' | 'numero' | 'data' | 'dataHora' | 'booleano'

/**
 * Qualquer valor aceito dentro de uma linha do dataset. `Date` é
 * normalizado com `toISOString()`, `null` vira string vazia e os demais
 * valores não numéricos passam por `String(valor)` quando usados onde um
 * texto é esperado (ver `normalizarValor`).
 */
export type ValorGrafico = string | number | boolean | Date | null

/**
 * Uma linha do dataset: um objeto simples, uma linha por registro, chaveado
 * pelo nome do campo (o mesmo nome usado em `ColunaGrafico.nome` e nos
 * campos de `MapeamentoGrafico`).
 */
export type LinhaGrafico = Record<string, ValorGrafico>

/**
 * Metadado opcional de uma coluna do dataset. Usado só para dar um nome
 * amigável (`rotulo`) a um campo — não é obrigatório declarar todas as
 * colunas usadas em `mapeamento`, e campos sem entrada aqui aparecem com o
 * próprio nome do campo.
 */
export type ColunaGrafico = {
    /** Nome do campo, igual à chave usada nas linhas e no `mapeamento`. */
    nome: string
    /** Tipo declarado da coluna. Ver `TipoColunaGrafico`. */
    tipo: TipoColunaGrafico
    /**
     * Nome amigável da coluna. Em gráficos com eixo, vira o nome da série
     * quando o campo é usado em `mapeamento.eixoY` (ver `obterRotuloDoCampo`).
     */
    rotulo?: string
}

/**
 * Dados brutos do gráfico: as linhas (obrigatórias) e, opcionalmente, os
 * metadados de coluna usados para dar rótulos amigáveis às séries.
 */
export type DatasetGrafico = {
    /**
     * Metadados opcionais das colunas. Não precisa cobrir todos os campos
     * usados em `mapeamento` — só os que precisam de um `rotulo` amigável.
     */
    colunas?: ColunaGrafico[]
    /** Uma linha por registro. Precisa ser um array (pode ser vazio). */
    linhas: LinhaGrafico[]
}

/**
 * Mapeia nomes de campos do dataset para os papéis que cada tipo de
 * gráfico espera. Quais campos são obrigatórios depende de `tipo`:
 *
 * - `barra`/`linha`/`area`: exigem `eixoX` e `eixoY`.
 * - `pizza`/`mapa`/`ranking`: exigem `rotulo` e `valor`.
 * - `gauge`: exige `valor` (`rotulo` é opcional).
 *
 * Todo campo referenciado aqui precisa existir na primeira linha do
 * dataset (ver `validarCampoExistente`), quando houver linhas.
 */
export type MapeamentoGrafico = {
    /**
     * Campo categórico do eixo X (ou eixo Y quando `opcoes.barra.horizontal`
     * é `true`). Valores repetidos são deduplicados e os valores numéricos
     * correspondentes são somados por categoria (ver `criarSerieComEixos`).
     */
    eixoX?: string
    /**
     * Campo(s) numérico(s) do eixo de valores. Uma string gera uma única
     * série; uma lista de strings gera uma série por campo (séries lado a
     * lado vindas de colunas separadas). Use `serie` em vez de lista aqui
     * quando as séries vêm de um agrupamento de linhas (ex.: uma linha por
     * mês+canal) ao invés de colunas separadas — as duas abordagens não se
     * combinam: `serie` só tem efeito quando `eixoY` é uma única string.
     */
    eixoY?: string | string[]
    /**
     * Campo cujos valores distintos viram séries separadas, agrupando
     * linhas (ex.: uma linha por mês+canal vira uma série por canal). Só é
     * usado quando `eixoY` é uma única string, não uma lista.
     */
    serie?: string
    /**
     * Campo com o nome/categoria de cada item. Obrigatório em
     * `pizza`/`mapa`/`ranking`; opcional em `gauge` (nome de cada leitura).
     * Em `mapa`, o valor precisa casar com os nomes do GeoJSON registrado.
     */
    rotulo?: string
    /**
     * Campo numérico do valor de cada item. Obrigatório em
     * `pizza`/`gauge`/`mapa`/`ranking`.
     */
    valor?: string
    /**
     * Campo opcional com uma cor (string CSS) por linha, aplicada ao item
     * correspondente. Suportado em `pizza`/`mapa`/`ranking`. Para cor por
     * série em gráficos com eixo, use `opcoes.serie.cor`, não este campo.
     */
    cor?: string
}

/**
 * Associa um nome de série a uma cor fixa, usado em `opcoes.serie.cor`.
 * `nome` precisa casar com o rótulo final da série: o `rotulo` da coluna em
 * `dataset.colunas`, o nome do campo (quando a coluna não tem `rotulo`),
 * `opcoes.serie.nome`, ou o valor do campo apontado por `mapeamento.serie`
 * (ver `obterCorDaSerie`).
 */
export type CorSerieGrafico = {
    /** Nome da série a colorir, pelo critério de match descrito acima. */
    nome: string
    /** Cor CSS aplicada à série (ex.: `'#0f766e'`). */
    cor: string
}

/**
 * Dados disponíveis para `RotuloGrafico.formato` quando informado como
 * função, equivalentes aos parâmetros que o ECharts passa para um
 * `formatter` de label/detail (ver `CallbackDataParams` do ECharts).
 */
export type ParametrosFormatadorRotulo = {
    /** Nome do ponto/fatia/região (`{b}` no template do ECharts). */
    name: string
    /** Valor numérico do ponto/fatia/região (`{c}` no template do ECharts). */
    value: number
    /** Percentual sobre o total, disponível apenas em `pizza` (`{d}` no template do ECharts). */
    percent?: number
    /** Nome da série (`{a}` no template do ECharts). */
    seriesName?: string
}

/**
 * Configuração genérica do label exibido sobre cada ponto/fatia/barra/
 * região, reaproveitada por `pizza`, gráficos com eixo, `gauge` (vira o
 * `detail`, o valor central) e `mapa`. Ver `criarRotulo`/`criarLinhaRotulo`.
 */
export type RotuloGrafico = {
    /** Exibe ou esconde o label. Default `true` quando `opcoes.rotulo` é informado. */
    mostrar?: boolean
    /**
     * Template de formatação do ECharts (ex.: `'{b}: {c} ({d}%)'`) ou uma
     * função que recebe os dados do ponto/fatia/região e retorna o texto já
     * formatado — use a função quando precisar aplicar casas decimais,
     * separador de milhar ou prefixo de moeda ao valor exibido no label (o
     * template do ECharts não formata números). Os placeholders de template
     * variam por tipo de gráfico: em pizza, `{b}` é o nome, `{c}` o valor e
     * `{d}` o percentual; em gauge, use `{value}`.
     */
    formato?: string | ((parametros: ParametrosFormatadorRotulo) => string)
    /** Tamanho da fonte do label, em px (`fontSize` do ECharts). */
    tamanhoFonte?: number
    /** Altura da linha do label (`lineHeight` do ECharts), para labels com quebra de linha. */
    alturaLinha?: number
    /** Espaçamento interno do label (`padding` do ECharts). */
    espacamento?: number
    /** Posição do label. Default `'top'` em gráficos com eixo. */
    posicao?: 'inside' | 'top' | 'left' | 'right' | 'bottom' | 'center'
    /**
     * Configuração da linha-guia (`labelLine`) até o label. Só tem efeito
     * em `pizza` — o ECharts não desenha `labelLine` em outros tipos.
     */
    linha?: {
        /** Comprimento do primeiro segmento da linha-guia (`labelLine.length`). */
        comprimento?: number
        /** Comprimento do segundo segmento da linha-guia (`labelLine.length2`). */
        comprimento2?: number
        /** Desenha a linha-guia com curva suave em vez de segmentos retos (`labelLine.smooth`). */
        suave?: boolean
    }
}

/**
 * Opções visuais de um `DefinicaoGrafico`. Todos os campos são opcionais e
 * têm defaults sensatos escolhidos pelo core — não repita um default aqui
 * "só para garantir". Campos sem relação com o `tipo` do gráfico são
 * ignorados pelo builder correspondente (ex.: `pizza` em um gráfico `barra`
 * não tem efeito).
 */
export type OpcoesGrafico = {
    /**
     * Empilha as séries de um gráfico com eixo (`barra`/`linha`/`area`) em
     * vez de desenhá-las lado a lado/sobrepostas. Vira `stack: 'total'` no
     * ECharts — todas as séries do gráfico compartilham a mesma pilha.
     */
    empilhado?: boolean
    /** Opções específicas de gráfico `barra`. */
    barra?: {
        /**
         * Desenha as barras na horizontal (eixo de categorias no Y, eixo de
         * valores no X) em vez do padrão vertical.
         */
        horizontal?: boolean
    }
    /** Exibe ou esconde a legenda. Default `true`. */
    mostrarLegenda?: boolean
    /** Exibe ou esconde o tooltip ao passar o mouse. Default `true`. */
    mostrarTooltip?: boolean
    /**
     * Sufixo de moeda anexado ao label do eixo de valores (vira o template
     * `'{value} <moeda>'`). Serve só para um sufixo simples; quando
     * `opcoes.formatadorValor` é informado, ele tem prioridade e `moeda` é
     * ignorado.
     */
    moeda?: string
    /**
     * Formata os valores numéricos exibidos no eixo de valores (gráficos
     * com eixo) e no tooltip. Recebe o valor numérico puro e retorna a
     * string já formatada — é o lugar certo para aplicar casas decimais,
     * separador de milhares ou prefixo de moeda (ex.: reaproveitando um
     * formatador que a aplicação já tem). Não afeta o label sobre cada
     * ponto/fatia/barra — para isso use `opcoes.rotulo.formato`.
     */
    formatadorValor?: (valor: number) => string
    /**
     * Opções do eixo de valores (eixo Y, ou eixo X quando
     * `opcoes.barra.horizontal` é `true`). Só se aplica a gráficos com eixo
     * (`barra`/`linha`/`area`).
     */
    eixoValor?: {
        /** Tamanho da fonte dos valores do eixo, em px (`axisLabel.fontSize` do ECharts). */
        tamanhoFonte?: number
    }
    /** Subtítulo exibido abaixo do título principal (`title.subtext` do ECharts). */
    subtitulo?: string
    /** Opções do título principal (`grafico.titulo`). */
    titulo?: {
        /** Alinhamento horizontal do título (`title.left` do ECharts, ex.: `'center'`). */
        esquerda?: string
    }
    /** Opções da legenda. Só têm efeito quando `mostrarLegenda` não é `false`. */
    legenda?: {
        /**
         * Orientação dos itens da legenda. Quando `posicao` é informado, já
         * tem um default sensato (`'horizontal'` em `'topo'`/`'rodape'`,
         * `'vertical'` em `'esquerda'`/`'direita'`) — informe `orientacao`
         * só para sobrescrever esse default.
         */
        orientacao?: 'horizontal' | 'vertical'
        /**
         * Alinhamento horizontal da legenda (`legend.left` do ECharts).
         * Sobrescreve o alinhamento horizontal calculado a partir de
         * `posicao`, quando os dois forem informados.
         */
        esquerda?: string
        /**
         * Lado da área do gráfico onde a legenda é posicionada. Default: em
         * gráficos com eixo (`barra`/`linha`/`area`), `'rodape'`; nos
         * demais tipos, usa o posicionamento padrão do ECharts.
         */
        posicao?: 'topo' | 'rodape' | 'esquerda' | 'direita'
    }
    /** Opções gerais da(s) série(s) do gráfico. */
    serie?: {
        /**
         * Nome da série, usado em `pizza`/`gauge`/`mapa` (tipos com uma
         * única série). Default: `grafico.titulo`. Em gráficos com eixo, o
         * nome de cada série vem de `dataset.colunas[].rotulo` ou de
         * `mapeamento.serie`, não deste campo.
         */
        nome?: string
        /**
         * Cores fixas por série, como lista `{ nome, cor }[]` — nunca como
         * string única ou array "na ordem" das séries. Ver `CorSerieGrafico`
         * para a regra de match de `nome`.
         */
        cor?: CorSerieGrafico[]
    }
    /**
     * Configuração do label sobre cada ponto/fatia/barra/região. Genérica
     * para todos os tipos de gráfico ECharts. Ver `RotuloGrafico`.
     */
    rotulo?: RotuloGrafico
    /** Opções específicas de gráfico `pizza`. */
    pizza?: {
        /** Raio da pizza (`series.radius` do ECharts). Default `'65%'`. */
        raio?: string
        /**
         * Aplica destaque de sombra na fatia ao passar o mouse. Default
         * `true`.
         */
        destacarAoPassarMouse?: boolean
    }
    /** Opções específicas de gráfico `gauge`. */
    gauge?: {
        /** Menor valor do marcador (`series.min` do ECharts). */
        minimo?: number
        /** Maior valor do marcador (`series.max` do ECharts). */
        maximo?: number
        /** Exibe o arco de progresso preenchido até o valor atual. */
        mostrarProgresso?: boolean
    }
    /** Opções específicas de gráfico `mapa`. */
    mapa?: {
        /**
         * Nome do mapa registrado no ECharts via `echarts.registerMap`
         * (ver `obterNomeMapa`/`registrarMapasPadrao`). Default `'BR'`.
         */
        nome?: string
        /** Permite zoom e pan no mapa (`roam` do ECharts). Default `true`. */
        permitirZoom?: boolean
        /**
         * Mantém o label da região visível ao passar o mouse sobre ela
         * (`emphasis.label.show` do ECharts). Default `true`.
         */
        mostrarRotuloAoDestacar?: boolean
        /** Tamanho do mapa dentro da área do gráfico (`series.layoutSize`). */
        tamanho?: string
        /** Posição do centro do mapa dentro da área do gráfico (`series.layoutCenter`). */
        centro?: {
            /** Posição horizontal do centro (ex.: `'50%'`). */
            x?: string
            /** Posição vertical do centro (ex.: `'50%'`). */
            y?: string
        }
        /**
         * Configuração da escala de cor (`visualMap` do ECharts), que
         * mapeia o valor de cada região para uma cor no degradê.
         */
        escalaVisual?: {
            /** Menor valor da escala. Default: o menor valor presente nos dados. */
            minimo?: number
            /** Maior valor da escala. Default: o maior valor presente nos dados. */
            maximo?: number
            /** Degradê de cores da escala, do menor para o maior valor. */
            cores?: string[]
            /** Texto exibido no extremo superior da escala. Default `'Maior'`. */
            textoSuperior?: string
            /** Texto exibido no extremo inferior da escala. Default `'Menor'`. */
            textoInferior?: string
            /** Permite ao usuário arrastar a escala para filtrar o mapa por faixa de valor. Default `true`. */
            calculavel?: boolean
            /** Alinhamento horizontal da escala (`visualMap.left` do ECharts). Default `'right'`. */
            esquerda?: string
        }
    }
    /**
     * Opções específicas de gráfico `ranking`. Só se aplicam a
     * `criarDadosRanking`/`criarHtmlRankingGrafico` — `ranking` não passa
     * por `criarOpcaoECharts`.
     */
    ranking?: {
        /** Limita a lista aos N primeiros itens após a ordenação. Sem limite por padrão. */
        limite?: number
        /** Destaca os 3 primeiros colocados com um layout de pódio. Default `true`. */
        mostrarPodio?: boolean
        /** Exibe o total somado de todos os itens. Default `true`. */
        mostrarTotal?: boolean
        /** Ordem de classificação pelo valor. Default `'decrescente'`. */
        ordem?: 'decrescente' | 'crescente'
        /**
         * Formata o valor de cada item e o total exibidos (`valorFormatado`/
         * `totalFormatado`). Default: `formatarNumero` do core.
         */
        formatadorValor?: (valor: number) => string
    }
}

/**
 * Definição completa de um gráfico do Agulhão Charts, independente de
 * React/DOM. É o único objeto que um agente deve montar manualmente — nunca
 * monte um `EChartsOption` à mão; deixe `criarOpcaoECharts` traduzir isto.
 */
export type DefinicaoGrafico = {
    /** Tipo do gráfico. Determina os campos obrigatórios em `mapeamento`. */
    tipo: TipoGrafico
    /** Título principal, exibido acima do gráfico quando informado. */
    titulo?: string
    /** Dados brutos (linhas + metadados opcionais de coluna). */
    dataset: DatasetGrafico
    /** Mapeia campos do dataset para os papéis esperados pelo `tipo`. */
    mapeamento: MapeamentoGrafico
    /** Opções visuais opcionais. Omita o que não precisar — os defaults já cobrem o caso comum. */
    opcoes?: OpcoesGrafico
}
