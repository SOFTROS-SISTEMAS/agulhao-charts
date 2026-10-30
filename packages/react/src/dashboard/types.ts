export type AgulhaoDashboardWidget = {
    /**
     * Identificador único do widget no dashboard.
     */
    id: string
    /**
     * Identificador do widget, que será usado para escolher o componente de renderização.
     *
     * Exemplo: "acompanhamentoPedidos" | "calendario"
     */
    widgetId: string
    titulo: string
    descricao: string
    /**
     * Intervalo que irá chamar a função de atualização do widget, em segundos. Se não informado, o widget não será atualizado automaticamente.
     */
    atualizaEmSegundos?: number
    ultimaSincronizacao?: string
    /**
     * Conteúdo processado do widget, que pode ser um gráfico, tabela ou qualquer outro tipo de conteúdo.
     */
    conteudo?: string
    /**
     *  Representa o layout do widget no dashboard, incluindo sua posição e tamanho. Se não informado, o widget será posicionado automaticamente pelo dashboard.
     */
    layout?: AgulhaoDashboardLayout
}

/**
 * Representa o layout de um widget no dashboard, incluindo sua posição e tamanho.
 */
export type AgulhaoDashboardLayout = {
    x?: number
    y?: number
    w?: number
    h?: number
}
