import { useState, useEffect } from 'react'
import './App.css'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import logo from '../temp_visuals/Logo_BarberTech.png'

const SERVICOS_DISPONIVEIS = [
  { nome: 'Corte Masculino', preco: 40, color: '#00d2ff', duracao: 30 },
  { nome: 'Barba Profissional', preco: 30, color: '#00ffc3', duracao: 30 },
  { nome: 'Corte + Barba', preco: 60, color: '#00a2ff', duracao: 60 },
  { nome: 'Sobrancelha', preco: 15, color: '#60efff', duracao: 30 },
  { nome: 'Pezinho / Acabamento', preco: 10, color: '#0061ff', duracao: 30 },
  { nome: 'Luzes / Platinado', preco: 80, color: '#00ffa2', duracao: 120 }
]

function App() {
  const [agendamentos, setAgendamentos] = useState(() => {
    try {
      const salvos = localStorage.getItem('barbertech_v4_data')
      return salvos ? JSON.parse(salvos) : []
    } catch (e) { return [] }
  })

  const [agora, setAgora] = useState(new Date())
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [barbeirosAtivos, setBarbeirosAtivos] = useState(1)
  const [servicoSelecionado, setServicoSelecionado] = useState('')
  const [horario, setHorario] = useState('')
  const [data, setData] = useState('')
  const [busca, setBusca] = useState('')
  const [periodo, setPeriodo] = useState('mes')
  
  const [seletorServicoAberto, setSeletorServicoAberto] = useState(false)
  const [seletorHoraAberto, setSeletorHoraAberto] = useState(false)
  const [seletorDataAberto, setSeletorDataAberto] = useState(false)

  const [mesCal, setMesCal] = useState(new Date().getMonth())
  const [anoCal, setAnoCal] = useState(new Date().getFullYear())
  const nomeMeses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
  
  const diasNoMes = new Date(anoCal, mesCal + 1, 0).getDate()
  const primeiroDia = new Date(anoCal, mesCal, 1).getDay()
  const gridDias = [...Array(primeiroDia).fill(null), ...Array.from({length: diasNoMes}, (_, i) => i + 1)]

  const handleTelefone = (e) => {
    let v = e.target.value.replace(/\D/g, "")
    if (v.length > 11) v = v.substring(0, 11)
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
    else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3")
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2")
    else if (v.length > 0) v = v.replace(/^(\d*)/, "($1")
    setTelefone(v)
  }

  const ehDataPassada = (dia) => {
    if (!dia) return false
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    const dataAlvo = new Date(anoCal, mesCal, dia); dataAlvo.setHours(0, 0, 0, 0)
    return dataAlvo < hoje
  }

  const mudarMes = (offset) => {
    let nMes = mesCal + offset; let nAno = anoCal
    if (nMes < 0) { nMes = 11; nAno-- } else if (nMes > 11) { nMes = 0; nAno++ }
    setMesCal(nMes); setAnoCal(nAno)
  }

  const selecionarDia = (dia) => {
    if (ehDataPassada(dia)) return
    setData(`${anoCal}-${String(mesCal + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`)
    setSeletorDataAberto(false)
  }

  useEffect(() => { localStorage.setItem('barbertech_v4_data', JSON.stringify(agendamentos)) }, [agendamentos])
  useEffect(() => { const timer = setInterval(() => setAgora(new Date()), 60000); return () => clearInterval(timer) }, [])

  const sEncontrado = SERVICOS_DISPONIVEIS.find(s => s.nome === servicoSelecionado)
  const precoAtual = sEncontrado?.preco || 0
  const corAtual = sEncontrado?.color || 'transparent'
  const duracaoAtual = sEncontrado?.duracao || 30

  const agendamentosFiltradosPorData = agendamentos.filter(item => {
    const dAgend = new Date(item.data + 'T12:00:00'); const hoje = new Date()
    if (periodo === 'hoje') return dAgend.toDateString() === hoje.toDateString()
    if (periodo === 'mes') return dAgend.getMonth() === hoje.getMonth() && dAgend.getFullYear() === hoje.getFullYear()
    return true
  })

  const dadosGrafico = SERVICOS_DISPONIVEIS.map(servico => {
    const total = agendamentosFiltradosPorData.filter(a => a.servico === servico.nome && a.status === 'concluido').reduce((acc, a) => acc + Number(a.valor), 0)
    return { nome: servico.nome.split(' ')[0], total, color: servico.color }
  }).filter(d => d.total > 0)

  const adicionarAgendamento = (e) => {
    e.preventDefault()
    if (!nome || !servicoSelecionado || !horario || !data) return alert("Preencha todos os campos!")
    setAgendamentos([...agendamentos, { id: Date.now(), cliente: nome, telefone, servico: servicoSelecionado, horario, data, valor: precoAtual, status: 'pendente' }])
    setNome(''); setTelefone(''); setServicoSelecionado(''); setHorario(''); setData('')
  }

  const mudarStatus = (id, nStatus) => setAgendamentos(agendamentos.map(i => i.id === id ? { ...i, status: nStatus } : i))
  
  const enviarLembrete = (i) => {
    const mensagemLimpa = `Olá ${i.cliente}, aqui é da BarberTech!\nPassando para lembrar do seu agendamento de *${i.servico}* hoje às *${i.horario}*. Nos vemos em breve!`;
    const urlFormatada = `https://wa.me/55${i.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagemLimpa)}`;
    window.open(urlFormatada, '_blank');
  }

  const ehHorarioPassado = (h) => {
    const hoje = new Date(); const partes = data.split('-')
    if (partes.length !== 3) return false
    const dAgend = new Date(partes[0], partes[1] - 1, partes[2])
    if (dAgend.toDateString() !== hoje.toDateString()) return false
    const [hrs, min] = h.split(':').map(Number)
    return hrs < hoje.getHours() || (hrs === hoje.getHours() && min < hoje.getMinutes())
  }

  const verificarDisponibilidade = (hSel) => {
    if (!data || !servicoSelecionado) return true
    const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m }
    const mIniNovo = toMin(hSel); const mFimNovo = mIniNovo + duracaoAtual
    const ocupados = agendamentos.filter(a => {
      if (a.data !== data || a.status === 'excluido') return false
      const durA = SERVICOS_DISPONIVEIS.find(s => s.nome === a.servico)?.duracao || 30
      const mIniA = toMin(a.horario); const mFimA = mIniA + durA
      return (mIniNovo < mFimA && mFimNovo > mIniA)
    })
    return ocupados.length < barbeirosAtivos
  }

  const ehHorarioBloqueado = (h) => ehHorarioPassado(h) || !verificarDisponibilidade(h)

  const horariosDisponiveis = []
  for(let i=8; i<=20; i++) { 
    horariosDisponiveis.push(`${String(i).padStart(2, '0')}:00`)
    horariosDisponiveis.push(`${String(i).padStart(2, '0')}:30`) 
  }

  return (
    <div className="app-container">
      <header>
        <div className="logo-container"><img src={logo} alt="Logo" className="app-logo" /></div>
        <div className="barbeiros-config">
          <span>Barbeiros Ativos:</span>
          <div className="barbeiros-selector">
            {[1, 2, 3].map(n => (
              <button key={n} type="button" className={barbeirosAtivos === n ? 'active' : ''} onClick={() => setBarbeirosAtivos(n)}>{n}</button>
            ))}
          </div>
        </div>
        <div className="filtro-periodo">
          {['hoje', 'mes', 'tudo'].map(p => <button key={p} type="button" className={periodo === p ? 'active' : ''} onClick={() => setPeriodo(p)}>{p === 'mes' ? 'Mês' : p.charAt(0).toUpperCase() + p.slice(1)}</button>)}
        </div>
        <div className="stats-bar">
          <div className="stat-card"><span>Faturamento ({periodo})</span><strong>R$ {agendamentosFiltradosPorData.filter(i => i.status === 'concluido').reduce((acc, i) => acc + Number(i.valor), 0).toFixed(2)}</strong></div>
          <div className="stat-card highlight"><span>Atendimentos ({periodo})</span><strong>{agendamentosFiltradosPorData.filter(i => i.status !== 'excluido').length} {agendamentosFiltradosPorData.filter(i => i.status !== 'excluido').length === 1 ? 'Cliente' : 'Clientes'}</strong></div>
        </div>
        {dadosGrafico.length > 0 && (
          <div className="grafico-container">
            <h3>Faturamento por Serviço (R$)</h3>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer><BarChart data={dadosGrafico}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" /><XAxis dataKey="nome" stroke="#888" fontSize={12} /><YAxis hide /><Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} /><Bar dataKey="total" radius={[4, 4, 0, 0]}>{dadosGrafico.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}</Bar></BarChart></ResponsiveContainer>
            </div>
          </div>
        )}
      </header>
      <main>
        <section className="novo-agendamento">
          <form onSubmit={adicionarAgendamento}>
            <input type="text" placeholder="Nome do Cliente" value={nome} onChange={(e)=>setNome(e.target.value)} />
            <input type="text" placeholder="WhatsApp" value={telefone} onChange={handleTelefone} />
            <div className={`custom-select ${seletorServicoAberto ? 'open' : ''}`} onClick={() => setSeletorServicoAberto(!seletorServicoAberto)}>
              <div className="select-trigger"><div className="trigger-content">{servicoSelecionado && <span className="dot" style={{ backgroundColor: corAtual }}></span>}{servicoSelecionado ? `${servicoSelecionado} (${duracaoAtual}min)` : 'Selecione o Serviço'}</div><span className="arrow">▼</span></div>
              <AnimatePresence>{seletorServicoAberto && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="select-options">{SERVICOS_DISPONIVEIS.map(s => (<div key={s.nome} className="option-item" onClick={(e) => { e.stopPropagation(); setServicoSelecionado(s.nome); setSeletorServicoAberto(false); }}><span className="dot" style={{ backgroundColor: s.color }}></span>{s.nome}<span className="price">R$ {s.preco.toFixed(2)}</span></div>))}</motion.div>)}</AnimatePresence>
            </div>
            <div className="row">
              <div 
                className={`custom-select mini ${seletorDataAberto ? 'open' : ''} ${!servicoSelecionado ? 'disabled-trigger' : ''}`} 
                onClick={() => servicoSelecionado ? setSeletorDataAberto(!seletorDataAberto) : alert('Selecione um serviço primeiro!')}
              >
                <div className="select-trigger">{data ? data.split('-').reverse().join('/') : 'Data'}<span className="icon">📅</span></div>
                <AnimatePresence>{seletorDataAberto && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="select-options calendar-popup" onClick={(e) => e.stopPropagation()}><div className="calendar-header"><button type="button" onClick={() => mudarMes(-1)}>◀</button><span>{nomeMeses[mesCal]} {anoCal}</span><button type="button" onClick={() => mudarMes(1)}>▶</button></div><div className="calendar-grid">{['D','S','T','Q','Q','S','S'].map(d => <div key={d} className="weekday">{d}</div>)}{gridDias.map((dia, i) => { const passado = ehDataPassada(dia); return (<div key={i} className={`day-item ${dia ? (passado ? 'disabled-day' : 'active-day') : 'empty-day'} ${data === `${anoCal}-${String(mesCal + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}` ? 'selected' : ''}`} onClick={() => dia && !passado && selecionarDia(dia)}>{dia}</div>) })}</div></motion.div>)}</AnimatePresence>
              </div>
              <div 
                className={`custom-select mini ${seletorHoraAberto ? 'open' : ''} ${!servicoSelecionado ? 'disabled-trigger' : ''}`} 
                onClick={() => servicoSelecionado ? setSeletorHoraAberto(!seletorHoraAberto) : alert('Selecione um serviço primeiro!')}
              >
                <div className="select-trigger">{horario ? horario : 'Hora'}<span className="icon">🕒</span></div>
                <AnimatePresence>{seletorHoraAberto && (<motion.div className="select-options scrollable">{horariosDisponiveis.map(h => { const bloqueado = ehHorarioBloqueado(h); return (<div key={h} className={`option-item justify-center ${bloqueado ? 'disabled-day' : ''}`} onClick={(e) => { if (bloqueado) return; e.stopPropagation(); setHorario(h); setSeletorHoraAberto(false); }}>{h}</div>) })}</motion.div>)}</AnimatePresence>
              </div>
            </div>
            <button type="submit">Agendar Agora</button>
          </form>
        </section>
        <section className="dashboard">
          <div className="header-lista"><h2>Próximos Clientes</h2><input className="input-busca" type="text" placeholder="🔍 Buscar" value={busca} onChange={(e) => setBusca(e.target.value)} /></div>
          <div className="lista-agendamentos">
            <AnimatePresence>{agendamentos.filter(item => item.cliente.toLowerCase().includes(busca.toLowerCase())).sort((a,b) => a.data.localeCompare(b.data) || a.horario.localeCompare(b.horario)).map((item) => { 
              const dataAgendamento = new Date(`${item.data}T${item.horario}:00`)
              const alertaAtivo = item.status === 'pendente' && (dataAgendamento - agora) / (1000 * 60 * 60) > 0 && (dataAgendamento - agora) / (1000 * 60 * 60) <= 2.1
              return (<motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`card-agendamento ${item.status} ${alertaAtivo ? 'urgente' : ''}`}><div className="data-horario"><span className="badge-hora">{item.horario}</span><span className="badge-data">{item.data.split('-').reverse().slice(0, 2).join('/')}</span></div><div className="info"><strong>{item.cliente}</strong><span>{item.servico}</span></div><div className="acoes">{alertaAtivo && <button type="button" className="btn-auto-zap" onClick={() => enviarLembrete(item)}>AVISAR 2H 📱</button>}{item.status === 'pendente' && !alertaAtivo && <button type="button" className="btn-zap" onClick={() => enviarLembrete(item)}>📱</button>}{item.status === 'pendente' && <button type="button" className="btn-concluir" onClick={() => mudarStatus(item.id, 'concluido')}>✅</button>}{item.status === 'concluido' && <span className="badge-concluido">CONCLUÍDO</span>}<button type="button" className="btn-lixo" onClick={() => mudarStatus(item.id, 'excluido')}>🗑️</button></div></motion.div>) 
            })}</AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  )
}
export default App
