import { z } from 'zod'
import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutItem } from 'react-grid-layout'
import { Cake, Calendar as CalendarIcon, ChevronLeft, ChevronRight, CircleDot, Receipt, StickyNote } from 'lucide-react'
import { AgulhaoDashboardWidget } from '../types'
import { zodStringToJson } from '../../utils'
import { zero } from '../../formatacoes'
import { Estrutura } from '../estrutura'
import { useDashboard } from '../context'

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const diasSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

type IconeEvento = typeof Cake

type TipoEventoPadrao = {
    titulo: string
    cor: string
    icone: IconeEvento
}

// Tipos de evento reconhecidos por padrão. Um evento com um "tipo" fora desta lista
// ainda é exibido, usando um ícone genérico e o título informado no próprio evento.
const tiposEventoPadrao: Record<string, TipoEventoPadrao> = {
    aniversariantes: { titulo: 'Aniversariantes', cor: '#ff8100', icone: Cake },
    contasPagar: { titulo: 'Contas a Pagar', cor: '#dc2626', icone: Receipt },
    contasReceber: { titulo: 'Contas a Receber', cor: '#16a34a', icone: Receipt },
    lembretes: { titulo: 'Lembretes', cor: '#2c8dd3', icone: StickyNote },
}

type EventoAgrupado = {
    tipo: string
    titulo: string
    cor: string
    icone: IconeEvento
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
                        padding: '0.5rem 0.7rem',
                        borderBottom: '1px solid var(--ag-dashboard-cor)',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <button type="button" onClick={() => navegaMes(0)} style={estiloBotaoNav} title="Ir para o mês atual">
                            <CalendarIcon size={15} />
                        </button>
                        <button type="button" onClick={() => navegaMes(-1)} style={estiloBotaoNav} title="Mês anterior">
                            <ChevronLeft size={15} />
                        </button>
                        <button type="button" onClick={() => navegaMes(1)} style={estiloBotaoNav} title="Próximo mês">
                            <ChevronRight size={15} />
                        </button>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {meses[mes]} de {ano}
                    </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', flex: 1, tableLayout: 'fixed' }}>
                    <thead>
                        <tr>
                            {diasSemana.map((diaSemana) => (
                                <th
                                    key={diaSemana}
                                    style={{
                                        background: '#003e85',
                                        color: '#fff',
                                        fontWeight: 400,
                                        fontSize: '0.7rem',
                                        padding: '0.35rem 0',
                                        textAlign: 'center',
                                    }}>
                                    {diaSemana}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {semanas.map((diasDaSemana, i) => (
                            <tr key={i}>
                                {diasDaSemana.map((dia) => (
                                    <CelulaDia key={dia.data} dia={dia} tipos={tiposEventoPadrao} />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Estrutura>
    )
}

function CelulaDia({ dia, tipos }: { dia: DiaCalendario; tipos: Record<string, TipoEventoPadrao> }) {
    const hoje = !dia.outroMes && dia.data === formataChaveData(new Date())
    const grupos = agrupaEventosDoDia(dia.eventos, tipos)

    return (
        <td
            style={{
                height: '64px',
                padding: '4px',
                textAlign: 'center',
                verticalAlign: 'top',
                border: '1px solid var(--ag-dashboard-cor)',
                background: dia.outroMes ? '#f5f5f5' : hoje ? '#e5eaff' : '#fff',
                color: dia.outroMes ? '#a1a1a1' : hoje ? '#0d0049' : '#141414',
            }}>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: hoje ? 700 : 400 }}>{dia.dia}</p>
            {grupos.length > 0 && (
                // Largura limitada a 2 ícones por linha (no máximo 4 tipos de evento padrão, logo até 2 linhas).
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', justifyContent: 'center', margin: '4px auto 0', width: '38px' }}>
                    {grupos.map((grupo) => {
                        const Icone = grupo.icone

                        return (
                            <Icone
                                key={grupo.tipo}
                                size={17}
                                strokeWidth={2.25}
                                style={{ color: grupo.cor, cursor: grupo.acao ? 'pointer' : 'default' }}
                                onClick={grupo.acao ? () => window.open(grupo.acao, '_blank') : undefined}>
                                <title>{grupo.titulo}</title>
                            </Icone>
                        )
                    })}
                </div>
            )}
        </td>
    )
}

// Agrupa os eventos do dia por "tipo", para exibir apenas um ícone por tipo (mesmo que
// existam vários eventos daquele tipo no mesmo dia).
function agrupaEventosDoDia(eventos: EventoCalendario[], tipos: Record<string, TipoEventoPadrao>): EventoAgrupado[] {
    const grupos = new Map<string, EventoAgrupado>()

    eventos.forEach((evento) => {
        const tipoPadrao = tipos[evento.tipo]
        const titulo = evento.titulo || tipoPadrao?.titulo || evento.tipo
        const cor = evento.cor || tipoPadrao?.cor || '#6b7280'
        const icone = tipoPadrao?.icone || CircleDot

        const existente = grupos.get(evento.tipo)
        if (existente) {
            if (!existente.titulo.includes(titulo)) existente.titulo += `, ${titulo}`
            existente.acao = existente.acao || evento.acao
        } else {
            grupos.set(evento.tipo, { tipo: evento.tipo, titulo, cor, icone, acao: evento.acao })
        }
    })

    return Array.from(grupos.values())
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
    borderRadius: '4px',
    padding: '4px 6px',
    cursor: 'pointer',
    color: 'inherit',
    display: 'flex',
    alignItems: 'center',
}

export const CalendarioLayout: LayoutItem = {
    i: 'calendario',
    x: 0,
    y: 0,
    w: 4,
    h: 5,
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
})

type Dados = z.infer<typeof schema>
type EventoCalendario = NonNullable<Dados['eventos']>[number]
