import { useState, useEffect } from 'react';
import { INITIAL_EMPLOYEES, INITIAL_REQUESTS, INITIAL_PONTO, TODAY, fmtBRL } from './data.js';
import { useLocalStorage, resetValeStorage } from './useLocalStorage.js';
import {
  IconHome, IconList, IconUsers, IconUser, IconPlus,
  IconBell, IconChevronRight, IconCalendar, IconWallet, IconClock,
  IconDollar, IconX
} from './icons.jsx';
import { Avatar, Sheet, ToastProvider } from './ui.jsx';
import { Dashboard, PedidosList, PerfilFuncionario, FuncionariosList } from './screens.jsx';
import { NovoPedido, NovoFuncionario, RequestDetail } from './forms.jsx';
import { PontoList, PontoDetail, RegistroPonto } from './ponto.jsx';
import { BubbleNav } from './BubbleNav.jsx';
import './styles.css';

// Bottom nav (4 itens). "Eu" sai daqui — fica acessível pelo avatar do topbar.
const NAV = [
  { id: 'dashboard',    label: 'Home',         icon: IconHome  },
  { id: 'pedidos',      label: 'Pedidos',      icon: IconList  },
  { id: 'ponto',        label: 'Ponto',        icon: IconClock },
  { id: 'funcionarios', label: 'Equipe',       icon: IconUsers }
];

// Sidebar desktop ganha "Eu" como último item.
const SIDEBAR_NAV = [...NAV, { id: 'perfil', label: 'Eu', icon: IconUser }];

function AppInner() {
  const [employees, setEmployees] = useLocalStorage('employees', INITIAL_EMPLOYEES);
  const [requests, setRequests]   = useLocalStorage('requests',  INITIAL_REQUESTS);
  const [ponto, setPonto]         = useLocalStorage('ponto',     INITIAL_PONTO);

  const [route, setRoute] = useState({ name: 'dashboard' });
  const [pedidosFilter, setPedidosFilter] = useState('todos');
  const [novoPedidoOpen, setNovoPedidoOpen] = useState(false);
  const [novoFuncOpen, setNovoFuncOpen] = useState(false);
  const [detailRequestId, setDetailRequestId] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  // Mês selecionado na lista de Ponto (visão geral)
  const today = new Date(TODAY);
  const [pontoMonth, setPontoMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Bottom sheet de registro de ponto
  const [registroPonto, setRegistroPonto] = useState(null);
  // shape: { employee, date: Date, existing: record|null }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [route]);

  const goNav = (name, opts = {}) => {
    if (name === 'pedidos' && opts.filter) setPedidosFilter(opts.filter);
    else if (name === 'pedidos') setPedidosFilter('todos');
    setRoute({ name });
    setFabOpen(false);
  };

  const openEmployee = (id) => setRoute({ name: 'perfil-emp', employeeId: id });
  const openPontoEmployee = (id) => setRoute({ name: 'ponto-emp', employeeId: id });
  const openRequest = (id) => setDetailRequestId(id);

  const handleSavePedido = (newReq) => setRequests(prev => [newReq, ...prev]);
  const handleSaveFunc = (newEmp) => setEmployees(prev => [...prev, newEmp]);
  const handleUpdateStatus = (rid, status) =>
    setRequests(prev => prev.map(r => r.id === rid ? { ...r, status } : r));

  const handleSavePonto = (rec) => {
    setPonto(prev => {
      const idx = prev.findIndex(p => p.employeeId === rec.employeeId && p.date === rec.date);
      if (idx === -1) return [...prev, rec];
      const next = [...prev];
      next[idx] = rec;
      return next;
    });
  };

  const openRegistroPonto = (employee, date, existing) => {
    setRegistroPonto({ employee, date, existing: existing || null });
  };

  const detailReq = requests.find(r => r.id === detailRequestId);
  const detailEmp = detailReq ? employees.find(e => e.id === detailReq.employeeId) : null;

  const topbar = (() => {
    if (route.name === 'dashboard') return {
      title: 'Olá, Marina',
      sub: new Date(TODAY).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
      showBell: true, showAvatar: true
    };
    if (route.name === 'pedidos') return { title: 'Pedidos', sub: `${requests.length} no total`, showBell: true, showAvatar: true };
    if (route.name === 'ponto') return { title: 'Ponto', sub: 'Folha mensal', showBell: false, showAvatar: true };
    if (route.name === 'funcionarios') return { title: 'Equipe', sub: `${employees.length} funcionários`, showBell: false, showAvatar: true };
    if (route.name === 'perfil') return { title: 'Configurações', sub: 'Sua conta', showBell: false, showAvatar: false };
    return null;
  })();

  const activeNav = (() => {
    if (route.name === 'perfil-emp') return 'funcionarios';
    if (route.name === 'ponto-emp')  return 'ponto';
    if (route.name === 'perfil')     return null; // não destaca nada na bottom nav
    return route.name;
  })();
  const showFAB = route.name === 'dashboard' || route.name === 'pedidos' || route.name === 'ponto';

  return (
    <div className="vale-app">
      {/* Desktop sidebar */}
      <aside className="vale-sidebar">
        <div className="vale-sidebar-brand">
          <div className="vale-sidebar-logo">V</div>
          <div>
            <div className="vale-sidebar-name">Vale</div>
            <div className="vale-sidebar-org">RH · Acme Ltda</div>
          </div>
        </div>
        {SIDEBAR_NAV.map(n => (
          <button key={n.id}
                  onClick={() => goNav(n.id)}
                  className={`vale-sidebar-item ${activeNav === n.id || route.name === n.id ? 'active' : ''}`}>
            <n.icon size={18}/> {n.label}
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <button onClick={() => setNovoPedidoOpen(true)}
                className="vale-btn vale-btn-primary"
                style={{ marginTop: 12 }}>
          <IconPlus size={18}/> Novo pedido
        </button>
      </aside>

      <div className="vale-shell">
        {topbar && (
          <header className={`vale-topbar ${scrolled ? 'scrolled' : ''}`}>
            <div>
              <h1>{topbar.title}</h1>
              <div className="vale-topbar-sub">{topbar.sub}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {topbar.showBell && (
                <button className="vale-icon-btn" aria-label="Notificações">
                  <IconBell size={18}/>
                </button>
              )}
              {topbar.showAvatar && (
                <button onClick={() => goNav('perfil')}
                        aria-label="Perfil"
                        style={{ padding: 0, background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Avatar nome="Marina Albuquerque" size={36}/>
                </button>
              )}
            </div>
          </header>
        )}

        <div className="vale-content">
          {route.name === 'dashboard' && (
            <Dashboard
              employees={employees} requests={requests} ponto={ponto}
              onNav={goNav}
              onOpenRequest={openRequest}
              onOpenEmployee={openEmployee}
            />
          )}
          {route.name === 'pedidos' && (
            <PedidosList
              employees={employees} requests={requests}
              initialFilter={pedidosFilter}
              onOpenRequest={openRequest}
              onOpenEmployee={openEmployee}
            />
          )}
          {route.name === 'ponto' && (
            <PontoList
              employees={employees} ponto={ponto}
              currentMonth={pontoMonth}
              setCurrentMonth={setPontoMonth}
              onOpenEmployee={openPontoEmployee}
            />
          )}
          {route.name === 'ponto-emp' && (() => {
            const emp = employees.find(e => e.id === route.employeeId);
            if (!emp) return null;
            return (
              <PontoDetail
                employee={emp}
                ponto={ponto}
                onBack={() => goNav('ponto')}
                onDayClick={(date, existing) => openRegistroPonto(emp, date, existing)}
              />
            );
          })()}
          {route.name === 'funcionarios' && (
            <FuncionariosList
              employees={employees} requests={requests}
              onOpenEmployee={openEmployee}
              onCreate={() => setNovoFuncOpen(true)}
            />
          )}
          {route.name === 'perfil-emp' && (() => {
            const emp = employees.find(e => e.id === route.employeeId);
            if (!emp) return null;
            return (
              <PerfilFuncionario
                employee={emp}
                employees={employees}
                requests={requests}
                ponto={ponto}
                onBack={() => goNav('funcionarios')}
                onOpenRequest={openRequest}
                onDayClick={(date, existing) => openRegistroPonto(emp, date, existing)}
              />
            );
          })()}
          {route.name === 'perfil' && (
            <div className="vale-screen" style={{ padding: 20 }}>
              <div className="vale-card" style={{ padding: 20, marginBottom: 16 }}>
                <div className="vale-row">
                  <Avatar nome="Marina Albuquerque" size={56} ring/>
                  <div className="vale-grow">
                    <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>
                      Marina Albuquerque
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      Coordenadora de RH · Acme Ltda
                    </div>
                  </div>
                </div>
              </div>
              {[
                { icon: IconBell,     label: 'Notificações',          val: 'Ativadas' },
                { icon: IconUsers,    label: 'Permissões e equipe',   val: '3 gestores' },
                { icon: IconCalendar, label: 'Período de fechamento', val: 'Mensal' },
                { icon: IconWallet,   label: 'Limite por funcionário', val: fmtBRL(2000) }
              ].map((row, i) => (
                <div key={i} className="vale-card vale-card-clickable vale-row"
                     style={{ padding: 14, marginBottom: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: 'var(--line-soft)',
                    color: 'var(--muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}><row.icon size={18}/></div>
                  <div className="vale-grow">
                    <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 14 }}>{row.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{row.val}</div>
                  </div>
                  <IconChevronRight size={18} style={{ color: 'var(--subtle)' }}/>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: '0 4px' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>
                  Modo demonstração — dados salvos só neste dispositivo (localStorage)
                </div>
                <button
                  className="vale-btn vale-btn-ghost vale-btn-block"
                  onClick={() => {
                    if (confirm('Resetar todos os dados (vales, ponto, funcionários) para o exemplo inicial? Essa ação não pode ser desfeita.')) {
                      resetValeStorage();
                      window.location.reload();
                    }
                  }}
                >
                  Resetar dados de demonstração
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAB speed-dial: clique abre opções "Novo vale" + "Registrar ponto" */}
      {showFAB && !fabOpen && (
        <button className="vale-fab" onClick={() => setFabOpen(true)}
                aria-label="Ações rápidas">
          <IconPlus size={24} strokeWidth={2.5}/>
        </button>
      )}
      {showFAB && fabOpen && (
        <>
          <div className="vale-fab-backdrop" onClick={() => setFabOpen(false)}/>
          <div className="vale-fab-menu">
            <button className="vale-fab-action" onClick={() => {
              setFabOpen(false);
              setNovoPedidoOpen(true);
            }}>
              <span className="vale-fab-action-icon"><IconDollar size={18}/></span>
              Novo vale
            </button>
            <button className="vale-fab-action" onClick={() => {
              setFabOpen(false);
              if (employees.length > 0) {
                openRegistroPonto(employees[0], new Date(TODAY), null);
              }
            }}>
              <span className="vale-fab-action-icon"><IconClock size={18}/></span>
              Registrar ponto
            </button>
            <button className="vale-fab" onClick={() => setFabOpen(false)} aria-label="Fechar">
              <IconX size={24} strokeWidth={2.5}/>
            </button>
          </div>
        </>
      )}

      <BubbleNav
        activeId={activeNav}
        items={NAV}
        onNav={goNav}
      />

      <Sheet open={novoPedidoOpen} onClose={() => setNovoPedidoOpen(false)} fullHeight>
        <NovoPedido
          employees={employees}
          onClose={() => setNovoPedidoOpen(false)}
          onSave={handleSavePedido}
        />
      </Sheet>

      <Sheet open={novoFuncOpen} onClose={() => setNovoFuncOpen(false)}>
        <NovoFuncionario
          onClose={() => setNovoFuncOpen(false)}
          onSave={handleSaveFunc}
        />
      </Sheet>

      <Sheet open={!!detailRequestId} onClose={() => setDetailRequestId(null)} title="Detalhes do pedido">
        <RequestDetail
          request={detailReq}
          employee={detailEmp}
          onClose={() => setDetailRequestId(null)}
          onUpdateStatus={handleUpdateStatus}
          onOpenEmployee={(id) => { setDetailRequestId(null); openEmployee(id); }}
        />
      </Sheet>

      <Sheet open={!!registroPonto} onClose={() => setRegistroPonto(null)} fullHeight>
        {registroPonto && (
          <RegistroPonto
            employee={registroPonto.employee}
            date={registroPonto.date}
            existing={registroPonto.existing}
            onClose={() => setRegistroPonto(null)}
            onSave={handleSavePonto}
          />
        )}
      </Sheet>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner/>
    </ToastProvider>
  );
}
