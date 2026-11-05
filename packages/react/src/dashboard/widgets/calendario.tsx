import { z } from 'zod'
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutItem } from 'react-grid-layout'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AgulhaoDashboardWidget } from '../types'
import { zodStringToJson } from '../../utils'
import { zero } from '../../formatacoes'
import { Estrutura } from '../estrutura'
import { useDashboard } from '../context'

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

// Quantas linhas de evento são exibidas antes de agrupar o restante em "+N".
const MAX_LINHAS_EVENTO = 2

type TipoEventoPadrao = {
    titulo: string
    cor: string
}

// Tipos de evento reconhecidos por padrão. Um evento com um "tipo" fora desta lista
// ainda é exibido, usando o título informado no próprio evento.
const tiposEventoPadrao: Record<string, TipoEventoPadrao> = {
    aniversariantes: { titulo: 'Aniversariantes', cor: '#ff8100' },
    contasPagar: { titulo: 'Contas a Pagar', cor: '#dc2626' },
    contasReceber: { titulo: 'Contas a Receber', cor: '#16a34a' },
    lembretes: { titulo: 'Lembretes', cor: '#2c8dd3' },
}

type EventoAgrupado = {
    tipo: string
    titulo: string
    cor: string
    quantidade: number
    acao?: string
}

type DiaCalendario = {
    dia: number
    data: string
    outroMes: boolean
    eventos: EventoCalendario[]
}

export function Calendario(w: AgulhaoDashboardWidget) {
    const { atualizaWidget } = useDashboard()

    const agora = new Date()
    const [mes, setMes] = useState(agora.getMonth())
    const [ano, setAno] = useState(agora.getFullYear())
    const [carregando, setCarregando] = useState(false)
    const [dados, setDados] = useState<Dados | null>(zodStringToJson(w.conteudo || '{}', schema).data || null)
    const intervalo = useRef<number | null>(null)

    useEffect(() => {
        if (w.atualizaEmSegundos && w.atualizaEmSegundos > 0) {
            intervalo.current = window.setInterval(() => {
                atualizar()
            }, w.atualizaEmSegundos * 1000)
        }

        return () => {
            if (intervalo.current) clearInterval(intervalo.current)
        }
    }, [])

    const atualizar = async () => {
        setCarregando(true)
        const resultado = await atualizaWidget(w.widgetId, w.id)
        setCarregando(false)

        if (resultado) {
            setDados(zodStringToJson(resultado, schema).data || null)
        }
    }

    const navegaMes = (contador: number) => {
        if (contador === 0) {
            const hoje = new Date()
            setMes(hoje.getMonth())
            setAno(hoje.getFullYear())
            return
        }

        let novoMes = mes + contador
        let novoAno = ano

        if (novoMes > 11) {
            novoMes = 0
            novoAno++
        } else if (novoMes < 0) {
            novoMes = 11
            novoAno--
        }

        setMes(novoMes)
        setAno(novoAno)
    }

    const semanas = useMemo(() => montaSemanasMes(ano, mes, dados?.eventos || []), [ano, mes, dados?.eventos])

    return (
        <Estrutura id={w.id} titulo={w.titulo} descricao={w.descricao} ultimaSincronizacao={w.ultimaSincronizacao} carregando={carregando}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.7rem 0.9rem',
                    }}>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a' }}>
                        {meses[mes]} {ano}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button type="button" onClick={() => navegaMes(-1)} style={estiloBotaoNav} title="Mês anterior">
                            <ChevronLeft size={16} />
                        </button>
                        <button type="button" onClick={() => navegaMes(0)} style={estiloBotaoMesAtual} title="Voltar para o mês atual">
                            Mês atual
                        </button>
                        <button type="button" onClick={() => navegaMes(1)} style={estiloBotaoNav} title="Próximo mês">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', flex: 1, tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            {diasSemana.map((diaSemana) => (
                                <th
                                    key={diaSemana}
                                    style={{
                                        color: '#9a9a9a',
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        letterSpacing: '0.04em',
                                        padding: '0.3rem 0 0.5rem',
                                        textAlign: 'center',
                                        borderTop: '1px solid var(--ag-dashboard-cor)',
                                        borderBottom: '1px solid var(--ag-dashboard-cor)',
                                    }}>
                                    {diaSemana}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {semanas.map((diasDaSemana, i) => (
                            <tr key={i}>
                                {diasDaSemana.map((dia, j) => (
                                    <CelulaDia
                                        key={dia.data}
                                        dia={dia}
                                        tipos={tiposEventoPadrao}
                                        links={dados?.links}
                                        ultimaColuna={j === diasDaSemana.length - 1}
                                        ultimaLinha={i === semanas.length - 1}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Estrutura>
    )
}

function CelulaDia({
    dia,
    tipos,
    links,
    ultimaColuna,
    ultimaLinha,
}: {
    dia: DiaCalendario
    tipos: Record<string, TipoEventoPadrao>
    links: Record<string, string> | undefined
    ultimaColuna: boolean
    ultimaLinha: boolean
}) {
    const hoje = !dia.outroMes && dia.data === formataChaveData(new Date())
    const grupos = agrupaEventosDoDia(dia.eventos, tipos, links)
    const linhasVisiveis = grupos.slice(0, MAX_LINHAS_EVENTO)
    const ocultos = grupos.slice(linhasVisiveis.length)

    return (
        <td
            style={{
                height: '84px',
                padding: '5px',
                verticalAlign: 'top',
                borderRight: ultimaColuna ? 'none' : '1px solid var(--ag-dashboard-cor)',
                borderBottom: ultimaLinha ? 'none' : '1px solid var(--ag-dashboard-cor)',
                opacity: dia.outroMes ? 0.45 : 1,
            }}>
            <span
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    marginBottom: '3px',
                    background: hoje ? '#0d0049' : 'transparent',
                    color: hoje ? '#fff' : '#1f1f1f',
                    fontSize: '0.9rem',
                    fontWeight: hoje ? 700 : 500,
                }}>
                {dia.dia}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {linhasVisiveis.map((grupo) => (
                    <div
                        key={grupo.tipo}
                        title={`${grupo.titulo} (${grupo.quantidade})`}
                        onClick={grupo.acao ? () => window.open(grupo.acao, '_blank') : undefined}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background: `${grupo.cor}1f`,
                            color: grupo.cor,
                            cursor: grupo.acao ? 'pointer' : 'default',
                            overflow: 'hidden',
                        }}>
                        <span
                            style={{
                                flex: 1,
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                lineHeight: 1.2,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}>
                            {grupo.titulo}
                        </span>
                        {grupo.quantidade > 1 && <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{grupo.quantidade}</span>}
                    </div>
                ))}

                {ocultos.length > 0 && (
                    <span
                        title={ocultos.map((grupo) => `${grupo.titulo} (${grupo.quantidade})`).join('\n')}
                        style={{ fontSize: '0.75rem', color: '#1c1c1c', fontWeight: 500 }}>
                        +{ocultos.length} mais
                    </span>
                )}
            </div>
        </td>
    )
}

// Agrupa os eventos do dia por "tipo", para exibir uma linha por tipo com a quantidade de eventos.
// Com um único evento daquele tipo no dia, usa o "acao" do próprio evento. Com mais de um,
// não há como escolher a ação de um evento específico, então usa o link comum em "links[tipo]".
function agrupaEventosDoDia(
    eventos: EventoCalendario[],
    tipos: Record<string, TipoEventoPadrao>,
    links: Record<string, string> | undefined,
): EventoAgrupado[] {
    const eventosPorTipo = new Map<string, EventoCalendario[]>()

    eventos.forEach((evento) => {
        const lista = eventosPorTipo.get(evento.tipo) || []
        lista.push(evento)
        eventosPorTipo.set(evento.tipo, lista)
    })

    return Array.from(eventosPorTipo.entries()).map(([tipo, lista]) => {
        const tipoPadrao = tipos[tipo]
        const primeiro = lista[0]

        return {
            tipo,
            titulo: tipoPadrao?.titulo || primeiro.titulo || tipo,
            cor: primeiro.cor || tipoPadrao?.cor || '#6b7280',
            quantidade: lista.length,
            acao: lista.length === 1 ? primeiro.acao : links?.[tipo],
        }
    })
}

// Monta as semanas (domingo a sábado) necessárias para exibir o mês por completo,
// incluindo os dias do mês anterior/seguinte usados para completar a primeira/última semana.
function montaSemanasMes(ano: number, mes: number, eventos: EventoCalendario[]): DiaCalendario[][] {
    const primeiroDiaSemana = new Date(ano, mes, 1).getDay()
    const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate()
    const totalCelulas = Math.ceil((primeiroDiaSemana + ultimoDiaMes) / 7) * 7

    const eventosPorData = new Map<string, EventoCalendario[]>()
    eventos.forEach((evento) => {
        const chave = normalizaData(evento.data)
        if (!chave) return

        const lista = eventosPorData.get(chave) || []
        lista.push(evento)
        eventosPorData.set(chave, lista)
    })

    const dias: DiaCalendario[] = []
    for (let i = 0; i < totalCelulas; i++) {
        const data = new Date(ano, mes, 1 - primeiroDiaSemana + i)
        const chave = formataChaveData(data)

        dias.push({
            dia: data.getDate(),
            data: chave,
            outroMes: data.getMonth() !== mes,
            eventos: eventosPorData.get(chave) || [],
        })
    }

    const semanas: DiaCalendario[][] = []
    for (let i = 0; i < dias.length; i += 7) {
        semanas.push(dias.slice(i, i + 7))
    }

    return semanas
}

const formataChaveData = (data: Date) => `${data.getFullYear()}-${zero(data.getMonth() + 1)}-${zero(data.getDate())}`

// Aceita tanto "YYYY-MM-DD" quanto "DD/MM/YYYY" como formato de data do evento.
function normalizaData(data: string): string | null {
    const isoMatch = data.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`

    const brMatch = data.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (brMatch) return `${brMatch[3]}-${brMatch[2]}-${brMatch[1]}`

    return null
}

const estiloBotaoNav: CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    padding: '5px',
    cursor: 'pointer',
    color: '#4b4b4b',
    display: 'flex',
    alignItems: 'center',
}

const estiloBotaoMesAtual: CSSProperties = {
    background: '#fff',
    border: '1px solid var(--ag-dashboard-cor)',
    borderRadius: '6px',
    padding: '4px 10px',
    cursor: 'pointer',
    color: '#1a1a1a',
    fontSize: '0.75rem',
}

export const CalendarioLayout: LayoutItem = {
    i: 'calendario',
    x: 0,
    y: 0,
    w: 5,
    h: 6,
    minW: 3,
    minH: 4,
    isResizable: true,
    isDraggable: true,
}

const schema = z.object({
    eventos: z
        .array(
            z.object({
                data: z.string(),
                tipo: z.string(),
                titulo: z.string().optional(),
                cor: z.string().optional(),
                acao: z.string().optional(),
            }),
        )
        .optional(),
    // Link comum por tipo de evento (ex.: "contasPagar"), usado quando há mais de um evento
    // daquele tipo no mesmo dia e não dá pra escolher a ação de um evento específico.
    links: z.record(z.string(), z.string()).optional(),
})

type Dados = z.infer<typeof schema>
type EventoCalendario = NonNullable<Dados['eventos']>[number]
