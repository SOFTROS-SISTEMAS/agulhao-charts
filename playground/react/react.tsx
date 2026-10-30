import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import { AgulhaoChart, AgulhaoDashboard } from '../../packages/react/src/index.js'
import type { DefinicaoGrafico } from '../../packages/core/src/index.js'

// import { Dashboard } from '../packages/react/src/Dashboard.js'
// Habilite a linha acima (e adicione uma opcao abaixo) quando o Dashboard estiver implementado.

type Grafico = 'barra' | 'pizza' | 'mapa' | 'ranking' | 'dashboard'
const opcoes: Record<Grafico, string> = {
    barra: 'Gráfico de barras',
    pizza: 'Gráfico de pizza',
    mapa: 'Mapa',
    ranking: 'Ranking',
    dashboard: 'Dashboard',
}

const graficos: Record<string, DefinicaoGrafico> = {
    barra: {
        tipo: 'barra',
        titulo: 'Vendas por dia',
        dataset: {
            linhas: [
                { dia: 'Seg', valor: 150 },
                { dia: 'Ter', valor: 230 },
                { dia: 'Qua', valor: 180 },
                { dia: 'Qui', valor: 275 },
                { dia: 'Sex', valor: 310 },
            ],
        },
        mapeamento: { eixoX: 'dia', eixoY: 'valor' },
    },
    pizza: {
        tipo: 'pizza',
        titulo: 'Participacao por canal',
        dataset: {
            linhas: [
                { canal: 'Loja fisica', valor: 420 },
                { canal: 'E-commerce', valor: 680 },
                { canal: 'Marketplace', valor: 310 },
            ],
        },
        mapeamento: { rotulo: 'canal', valor: 'valor' },
    },
    mapa: {
        tipo: 'mapa',
        titulo: 'Indicador por estado',
        dataset: {
            linhas: [
                { estado: 'São Paulo', valor: 46649 },
                { estado: 'Minas Gerais', valor: 20998 },
                { estado: 'Bahia', valor: 14985 },
            ],
        },
        mapeamento: { rotulo: 'estado', valor: 'valor' },
        opcoes: { mapa: { nome: 'BR' } },
    },
    ranking: {
        tipo: 'ranking',
        titulo: 'Ranking de vendedores',
        dataset: {
            linhas: [
                { nome: 'Ana', total: 120000 },
                { nome: 'Bruno', total: 240000 },
                { nome: 'Carla', total: 180000 },
            ],
        },
        mapeamento: { rotulo: 'nome', valor: 'total' },
    },
}

function App() {
    const [tipo, setTipo] = useState<Grafico>('dashboard')

    return (
        <div className="pagina">
            <header>
                <div>
                    <h1>React</h1>
                    <p className="descricao">
                        Edite os arquivos em <code>packages/react/src</code> (ou <code>packages/core/src</code>) e veja o resultado aqui, sem rodar{' '}
                        <code>npm run build</code> em nenhum pacote.
                    </p>
                </div>

                <select value={tipo} onChange={(evento) => setTipo(evento.target.value as Grafico)}>
                    {Object.entries(opcoes).map(([chave, valor]) => (
                        <option key={chave} value={chave}>
                            {valor}
                        </option>
                    ))}
                </select>
            </header>
            {tipo === 'dashboard' ? (
                <div className="dashboard">
                    <AgulhaoDashboard
                        widgets={[
                            {
                                id: '149',
                                titulo: 'Acompanhamento dos pedidos',
                                descricao: 'Gráfico que apresenta a distrubuição dos pedidos conforme o status',
                                widgetId: 'acompanhamentoPedidos',
                                conteudo:
                                    '{"pecasFaturadas":100,"pecas":20,"registros":10,"bruto":1000,"descontos":200,"outros":100,"liquido":100,"lista":[{"status":"ABE","quantidade":10,"valor":100},{"status":"FAT","quantidade":20,"valor":200},{"status":"EXP","quantidade":30,"valor":300},{"status":"DES","quantidade":50,"valor":500}]}',
                            },
                        ]}
                    />
                </div>
            ) : (
                <section className="preview">
                    <AgulhaoChart grafico={graficos[tipo]} altura={420} />
                </section>
            )}
        </div>
    )
}

createRoot(document.getElementById('app')!).render(<App />)
