import { useState, useMemo } from 'react';
import { TODAY, fmtBRL, fmtDate, fmtDateLong, relativeTime } from './data.js';
import {
  IconWallet, IconClock, IconCheck, IconUsers, IconFileText,
  IconBriefcase, IconBuilding, IconChevronLeft, IconChevronRight,
  IconSearch, IconRefresh, IconPlus
} from './icons.jsx';
import { Avatar, StatusBadge, EmptyState, FreqDot, useToast } from './ui.jsx';

// ---------- Dashboard ----------
export const Dashboard = ({ employees, requests, onNav, onOpenRequest, onOpenEmployee }) => {
  const monthStart = new Date(2026, 4, 1);
  const monthRequests = requests.filter(r => new Date(r.data) >= monthStart);

  const totalMes = monthRequests.reduce((s, r) => s + r.valor, 0);
  const pendentes = monthRequests.filter(r => r.status === 'pendente').length;
  const aprovados = monthRequests.filter(r => r.status === 'aprovado' || r.status === 'pago').length;

  const counts = {};
  monthRequests.forEach(r => { counts[r.employeeId] = (counts[r.employeeId] || 0) + 1; });
  const top3 = Object.entries(counts)
    .map(([id, count]) => ({
      employee: employees.find(e => e.id === id), count,
      total: monthRequests.filter(r => r.employeeId === id).reduce((s, r) => s + r.valor, 0)
    }))
    .filter(x => x.employee)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(TODAY);
    d.setDate(d.getDate() - (6 - i));
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate() + 1);
    const dayReqs = requests.filter(r => {
      const rd = new Date(r.data);
      return rd >= dayStart && rd < dayEnd;
    });
    return {
      label: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3),
      total: dayReqs.reduce((s, r) => s + r.valor, 0),
      count: dayReqs.length
    };
  });
  const maxBar = Math.max(...last7.map(x => x.total), 1);

  const recentes = [...monthRequests]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 3);

  return (
    <div className="vale-screen" style={{ padding: '0 20px' }}>
      {/* Hero stat */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary) 100%)',
        borderRadius: 16,
        padding: '20px 22px',
        color: '#fff',
        marginBottom: 16,
        boxShadow: '0 8px 24px rgba(15,118,110,0.20)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
                     fontWeight: 500, opacity: 0.85, letterSpacing: 0.06, textTransform: 'uppercase' }}>
          <IconWallet size={14}/> Total pedido em maio
        </div>
        <div className="vale-stat-num-lg tabular" style={{ color: '#fff', marginTop: 6 }}>
          {fmtBRL(totalMes)}
        </div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-end', gap: 4, height: 48 }}>
          {last7.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                                  alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%',
                height: `${Math.max((d.total / maxBar) * 36, 3)}px`,
                background: d.total > 0 ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.18)',
                borderRadius: 3,
                transition: 'height 280ms ease'
              }} />
              <div style={{ fontSize: 10, opacity: 0.7, fontWeight: 500 }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pendente / Aprovado split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <button className="vale-card vale-card-clickable"
                onClick={() => onNav('pedidos', { filter: 'pendentes' })}
                style={{ padding: 16, textAlign: 'left' }}>
          <div className="vale-row" style={{ marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--chip-warn-bg)', color: 'var(--chip-warn-fg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <IconClock size={16}/>
            </div>
          </div>
          <div className="vale-stat-num tabular">{pendentes}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Pendentes</div>
        </button>

        <button className="vale-card vale-card-clickable"
                onClick={() => onNav('pedidos', { filter: 'aprovados' })}
                style={{ padding: 16, textAlign: 'left' }}>
          <div className="vale-row" style={{ marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--chip-ok-bg)', color: 'var(--chip-ok-fg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <IconCheck size={16}/>
            </div>
          </div>
          <div className="vale-stat-num tabular">{aprovados}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Aprovados</div>
        </button>
      </div>

      {/* Top 3 */}
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
          Top funcionários do mês
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{monthRequests.length} pedidos</div>
      </div>

      <div className="vale-card" style={{ padding: 4, marginBottom: 16 }}>
        {top3.length === 0 ? (
          <EmptyState
            icon={IconUsers}
            title="Sem pedidos este mês"
            body="Quando houver pedidos, os funcionários mais ativos aparecerão aqui."
          />
        ) : top3.map((x, i) => (
          <button
            key={x.employee.id}
            onClick={() => onOpenEmployee(x.employee.id)}
            className="vale-row"
            style={{
              padding: '12px 14px', width: '100%', textAlign: 'left',
              borderRadius: 10,
              transition: 'background 160ms ease',
              background: 'transparent',
              borderTop: i > 0 ? '1px solid var(--line-soft)' : 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--line-soft)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 999,
              background: i === 0 ? 'var(--primary)' : 'var(--line-soft)',
              color: i === 0 ? '#fff' : 'var(--muted)',
              fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>{i + 1}</div>
            <Avatar nome={x.employee.nome} size={36}/>
            <div className="vale-grow">
              <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 14 }}>
                {x.employee.nome}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{x.employee.cargo}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="tabular" style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                {x.count} {x.count === 1 ? 'pedido' : 'pedidos'}
              </div>
              <div className="tabular" style={{ fontSize: 12, color: 'var(--muted)' }}>{fmtBRL(x.total)}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Atividade recente */}
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
          Atividade recente
        </div>
        <button onClick={() => onNav('pedidos')} className="vale-btn-link"
                style={{ fontSize: 13, fontWeight: 600 }}>
          Ver tudo
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recentes.map(r => {
          const e = employees.find(x => x.id === r.employeeId);
          return (
            <button key={r.id} onClick={() => onOpenRequest(r.id)}
                    className="vale-card vale-card-clickable vale-row"
                    style={{ padding: 12, textAlign: 'left', width: '100%' }}>
              <Avatar nome={e.nome} size={36}/>
              <div className="vale-grow">
                <div className="vale-row" style={{ gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{e.nome}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {relativeTime(r.data)} · {e.cargo}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="tabular" style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>
                  {fmtBRL(r.valor)}
                </div>
                <div style={{ marginTop: 4 }}>
                  <StatusBadge status={r.status} size="sm"/>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Pedidos list ----------
const FILTERS = [
  { id: 'todos',     label: 'Todos' },
  { id: 'pendentes', label: 'Pendentes' },
  { id: 'aprovados', label: 'Aprovados' },
  { id: 'mes',       label: 'Este mês' },
  { id: 'pago',      label: 'Pagos' },
  { id: 'negado',    label: 'Negados' }
];

export const PedidosList = ({ employees, requests, initialFilter = 'todos', onOpenRequest, onOpenEmployee }) => {
  const [filter, setFilter] = useState(initialFilter);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const monthStart = new Date(2026, 4, 1);
  const filtered = useMemo(() => {
    let r = [...requests].sort((a, b) => new Date(b.data) - new Date(a.data));
    if (filter === 'pendentes') r = r.filter(x => x.status === 'pendente');
    if (filter === 'aprovados') r = r.filter(x => x.status === 'aprovado' || x.status === 'pago');
    if (filter === 'pago')      r = r.filter(x => x.status === 'pago');
    if (filter === 'negado')    r = r.filter(x => x.status === 'negado');
    if (filter === 'mes')       r = r.filter(x => new Date(x.data) >= monthStart);
    return r;
  }, [requests, filter]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast('Lista atualizada', 'success');
    }, 900);
  };

  const groups = {};
  filtered.forEach(r => {
    const key = relativeTime(r.data);
    (groups[key] ||= []).push(r);
  });

  return (
    <div className="vale-screen">
      <div className="vale-chips">
        {FILTERS.map(f => (
          <button key={f.id}
                  className={`vale-chip ${filter === f.id ? 'active' : ''}`}
                  onClick={() => setFilter(f.id)}>
            {f.label}
            {filter === f.id && filtered.length > 0 && (
              <span style={{ marginLeft: 6, opacity: 0.7 }}>· {filtered.length}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>
        {refreshing && (
          <div className="vale-ptr">
            <IconRefresh size={14} className="vale-ptr-spin"/> Atualizando…
          </div>
        )}

        {!refreshing && (
          <button onClick={handleRefresh} style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
            color: 'var(--muted)', margin: '0 auto 12px', padding: '6px 12px',
            borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--line)'
          }}>
            <IconRefresh size={12}/> Puxe para atualizar
          </button>
        )}

        {filtered.length === 0 && (
          <EmptyState
            icon={IconFileText}
            title="Nenhum pedido encontrado"
            body="Tente ajustar os filtros ou criar um novo pedido."
          />
        )}

        {Object.entries(groups).map(([groupLabel, items]) => (
          <div key={groupLabel} style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: 'var(--subtle)',
              textTransform: 'uppercase', letterSpacing: 0.08,
              padding: '4px 4px 8px'
            }}>{groupLabel}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(r => {
                const e = employees.find(x => x.id === r.employeeId);
                return (
                  <div key={r.id}
                       className="vale-card vale-card-clickable"
                       style={{ padding: 14 }}
                       onClick={() => onOpenRequest(r.id)}>
                    <div className="vale-row">
                      <button onClick={(ev) => { ev.stopPropagation(); onOpenEmployee(e.id); }}>
                        <Avatar nome={e.nome} size={44}/>
                      </button>
                      <div className="vale-grow">
                        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
                          {e.nome}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                          {e.cargo} · {fmtDate(r.data)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="tabular" style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                          {fmtBRL(r.valor)}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <StatusBadge status={r.status} size="sm"/>
                        </div>
                      </div>
                    </div>
                    {r.obs && (
                      <div style={{
                        marginTop: 10, paddingTop: 10,
                        borderTop: '1px solid var(--line-soft)',
                        fontSize: 13, color: 'var(--muted)',
                        display: 'flex', gap: 8, alignItems: 'flex-start'
                      }}>
                        <IconFileText size={14} style={{ marginTop: 2, flexShrink: 0, color: 'var(--subtle)' }}/>
                        <span>{r.obs}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------- Perfil funcionário ----------
export const PerfilFuncionario = ({ employee, requests, onBack, onOpenRequest }) => {
  const reqs = requests.filter(r => r.employeeId === employee.id)
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  const yearStart = new Date(2026, 0, 1);
  const yearReqs = reqs.filter(r => new Date(r.data) >= yearStart);
  const totalAno = yearReqs.reduce((s, r) => s + r.valor, 0);
  const valorMedio = yearReqs.length ? totalAno / yearReqs.length : 0;
  const ultimo = reqs[0];

  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(TODAY);
    d.setMonth(d.getMonth() - (11 - i));
    return { m: d.getMonth(), y: d.getFullYear(),
             label: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').slice(0, 3) };
  });
  const monthCounts = months.map(m => reqs.filter(r => {
    const d = new Date(r.data);
    return d.getMonth() === m.m && d.getFullYear() === m.y;
  }).length);
  const maxMonth = Math.max(...monthCounts, 1);

  return (
    <div className="vale-screen">
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--line)',
        padding: '8px 20px 24px'
      }}>
        <div style={{ marginBottom: 16 }}>
          <button className="vale-icon-btn vale-icon-btn-ghost" onClick={onBack}
                  aria-label="Voltar">
            <IconChevronLeft size={20}/>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar nome={employee.nome} size={72} ring/>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)',
                         letterSpacing: '-0.01em' }}>{employee.nome}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
                         fontSize: 13, color: 'var(--muted)' }}>
              <IconBriefcase size={13}/> {employee.cargo}
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--subtle)' }}/>
              <IconBuilding size={13}/> {employee.setor}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
          <div className="vale-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500,
                         letterSpacing: 0.06, textTransform: 'uppercase', marginBottom: 6 }}>Total ano</div>
            <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)',
                                              letterSpacing: '-0.01em' }}>{fmtBRL(totalAno)}</div>
          </div>
          <div className="vale-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500,
                         letterSpacing: 0.06, textTransform: 'uppercase', marginBottom: 6 }}>Médio</div>
            <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)',
                                              letterSpacing: '-0.01em' }}>{fmtBRL(valorMedio)}</div>
          </div>
          <div className="vale-card" style={{ padding: 14 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500,
                         letterSpacing: 0.06, textTransform: 'uppercase', marginBottom: 6 }}>Último</div>
            <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)',
                                              letterSpacing: '-0.01em' }}>
              {ultimo ? relativeTime(ultimo.data) : '—'}
            </div>
          </div>
        </div>

        <div className="vale-card" style={{ padding: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Frequência (12 meses)</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{reqs.length} pedidos</div>
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 48 }}>
            {months.map((m, i) => {
              const c = monthCounts[i];
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                                      alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%',
                    height: `${Math.max((c / maxMonth) * 36, 4)}px`,
                    background: c > 0 ? 'var(--primary)' : 'var(--line)',
                    borderRadius: 3
                  }}/>
                  <div style={{ fontSize: 9, color: 'var(--subtle)', fontWeight: 500 }}>{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 12 }}>
          Histórico de pedidos
        </div>

        {reqs.length === 0 ? (
          <EmptyState
            icon={IconFileText}
            title="Nenhum pedido ainda"
            body="Este funcionário não possui histórico de vales."
          />
        ) : (
          <div className="vale-timeline">
            <div className="vale-timeline-line"/>
            {reqs.map((r) => (
              <div key={r.id} className="vale-timeline-item">
                <div className="vale-timeline-dot"><FreqDot status={r.status}/></div>
                <div className="vale-card vale-card-clickable" onClick={() => onOpenRequest(r.id)}
                     style={{ padding: 14 }}>
                  <div className="vale-row">
                    <div className="vale-grow">
                      <div className="tabular" style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
                        {fmtBRL(r.valor)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                        {fmtDateLong(r.data)}
                      </div>
                    </div>
                    <StatusBadge status={r.status} size="sm"/>
                  </div>
                  {r.obs && (
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8,
                                 paddingTop: 8, borderTop: '1px solid var(--line-soft)' }}>
                      {r.obs}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Funcionários list ----------
export const FuncionariosList = ({ employees, requests, onOpenEmployee, onCreate }) => {
  const [q, setQ] = useState('');
  const filtered = employees.filter(e =>
    e.nome.toLowerCase().includes(q.toLowerCase()) ||
    e.cargo.toLowerCase().includes(q.toLowerCase()) ||
    e.setor.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="vale-screen" style={{ padding: '0 20px' }}>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <IconSearch size={18} style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--subtle)'
        }}/>
        <input
          className="vale-input"
          style={{ paddingLeft: 42 }}
          placeholder="Buscar funcionário…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <button onClick={onCreate} className="vale-btn vale-btn-ghost vale-btn-block"
              style={{ marginBottom: 16 }}>
        <IconPlus size={18}/> Novo funcionário
      </button>

      {filtered.length === 0 ? (
        <EmptyState icon={IconUsers} title="Nenhum funcionário encontrado"/>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(e => {
            const count = requests.filter(r => r.employeeId === e.id).length;
            return (
              <button key={e.id} onClick={() => onOpenEmployee(e.id)}
                      className="vale-card vale-card-clickable vale-row"
                      style={{ padding: 12, textAlign: 'left', width: '100%' }}>
                <Avatar nome={e.nome} size={44}/>
                <div className="vale-grow">
                  <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{e.nome}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {e.cargo} · {e.setor}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="tabular" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                    {count}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {count === 1 ? 'pedido' : 'pedidos'}
                  </div>
                </div>
                <IconChevronRight size={18} style={{ color: 'var(--subtle)' }}/>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
