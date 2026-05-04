import { useState, useEffect } from 'react';
import { INITIAL_EMPLOYEES, INITIAL_REQUESTS, TODAY, fmtBRL } from './data.js';
import {
  IconHome, IconList, IconUsers, IconUser, IconPlus,
  IconBell, IconChevronRight, IconCalendar, IconWallet
} from './icons.jsx';
import { Avatar, Sheet, ToastProvider } from './ui.jsx';
import { Dashboard, PedidosList, PerfilFuncionario, FuncionariosList } from './screens.jsx';
import { NovoPedido, NovoFuncionario, RequestDetail } from './forms.jsx';
import './styles.css';

const NAV = [
  { id: 'dashboard',    label: 'Dashboard',    icon: IconHome },
  { id: 'pedidos',      label: 'Pedidos',      icon: IconList },
  { id: 'funcionarios', label: 'Equipe',       icon: IconUsers },
  { id: 'perfil',       label: 'Eu',           icon: IconUser }
];

function AppInner() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const [route, setRoute] = useState({ name: 'dashboard' });
  const [pedidosFilter, setPedidosFilter] = useState('todos');
  const [novoPedidoOpen, setNovoPedidoOpen] = useState(false);
  const [novoFuncOpen, setNovoFuncOpen] = useState(false);
  const [detailRequestId, setDetailRequestId] = useState(null);
  const [scrolled, setScrolled] = useState(false);

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
  };

  const openEmployee = (id) => setRoute({ name: 'perfil-emp', employeeId: id });
  const openRequest = (id) => setDetailRequestId(id);

  const handleSavePedido = (newReq) => setRequests(prev => [newReq, ...prev]);
  const handleSaveFunc = (newEmp) => setEmployees(prev => [...prev, newEmp]);
  const handleUpdateStatus = (rid, status) =>
    setRequests(prev => prev.map(r => r.id === rid ? { ...r, status } : r));

  const detailReq = requests.find(r => r.id === detailRequestId);
  const detailEmp = detailReq ? employees.find(e => e.id === detailReq.employeeId) : null;

  const topbar = (() => {
    if (route.name === 'dashboard') return {
      title: 'Olá, Marina',
      sub: new Date(TODAY).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
      showBell: true
    };
    if (route.name === 'pedidos') return { title: 'Pedidos', sub: `${requests.length} no total`, showBell: true };
    if (route.name === 'funcionarios') return { title: 'Equipe', sub: `${employees.length} funcionários`, showBell: false };
    if (route.name === 'perfil') return { title: 'Configurações', sub: 'Sua conta', showBell: false };
    return null;
  })();

  const activeNav = route.name === 'perfil-emp' ? 'funcionarios' : route.name;
  const showFAB = route.name !== 'perfil-emp' && route.name !== 'perfil';

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
        {NAV.map(n => (
          <button key={n.id}
                  onClick={() => goNav(n.id)}
                  className={`vale-sidebar-item ${activeNav === n.id ? 'active' : ''}`}>
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
            {topbar.showBell && (
              <button className="vale-icon-btn" aria-label="Notificações">
                <IconBell size={18}/>
              </button>
            )}
          </header>
        )}

        <div className="vale-content">
          {route.name === 'dashboard' && (
            <Dashboard
              employees={employees} requests={requests}
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
                onBack={() => goNav('funcionarios')}
                onOpenRequest={openRequest}
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
            </div>
          )}
        </div>
      </div>

      {showFAB && (
        <button className="vale-fab" onClick={() => setNovoPedidoOpen(true)}
                aria-label="Novo pedido">
          <IconPlus size={24} strokeWidth={2.5}/>
        </button>
      )}

      <nav className="vale-bottom-nav">
        {NAV.map(n => (
          <button key={n.id}
                  className={`vale-nav-item ${activeNav === n.id ? 'active' : ''}`}
                  onClick={() => goNav(n.id)}>
            <n.icon size={22}/>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

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
