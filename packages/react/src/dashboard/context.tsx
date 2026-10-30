import { createContext, useContext } from 'react'

interface DashboardContextProps {
    atualizaWidget: (widgetId: string, id: string) => Promise<string | null>
}

export const DashboardContext = createContext<DashboardContextProps>({
    atualizaWidget: () => Promise.resolve(null),
})

export function useDashboard() {
    const context = useContext(DashboardContext)

    return context
}
