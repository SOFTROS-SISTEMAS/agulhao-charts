import { ReactNode } from 'react'

export function Estrutura({ children, titulo, descricao, ultimaSincronizacao, id, carregando, periodo }: EstruturaProps) {
    return (
        <div
            id={id}
            style={{
                backgroundColor: 'white',
                border: '1px solid var(--ag-dashboard-cor)',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '0.8rem',
            }}>
            <div
                style={{
                    borderBottom: '1px solid var(--ag-dashboard-cor)',
                    userSelect: 'none',
                    padding: '0.5rem',
                }}
                className="drag-handle">
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{titulo}</p>
                <p style={{ fontSize: '0.75rem', color: '#646464' }}>{descricao}</p>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>{children}</div>
            <div
                style={{
                    borderTop: '1px solid var(--ag-dashboard-cor)',
                    padding: '0.3rem 0.5rem',
                    fontSize: '0.75rem',
                    color: '#767676',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '8px',
                }}>
                <span>
                    {ultimaSincronizacao || 'Nenhuma sincronização realizada'}
                    {carregando && ' · Carregando...'}
                </span>
                {periodo && <span>Período: {periodo}</span>}
            </div>
        </div>
    )
}

interface EstruturaProps {
    children: ReactNode
    titulo?: string
    descricao?: string
    ultimaSincronizacao?: string
    id: string
    carregando?: boolean
    periodo?: string
}
