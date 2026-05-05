// Ponto (folha de ponto) — list, detail (calendar), record sheet
import { useState } from 'react';
import {
  TODAY, STANDARD_HOURS_DAY,
  dateKey, isWeekend, timeToMins, minsToHuman, calcWorked
} from './data.js';
import {
  IconChevronLeft, IconChevronRight, IconCalendar
} from './icons.jsx';
import { Avatar, EmptyState, useToast } from './ui.jsx';

// ---------- Lista de Ponto (visão geral) ----------
export const PontoList = ({ employees, ponto, currentMonth, setCurrentMonth, onOpenEmployee }) => {
  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const monthRecords = ponto.filter(p => {
    const d = new Date(p.date + 'T12:00:00');
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  });

  const totalMins = monthRecords.reduce((s, r) => s + calcWorked(r), 0);
  const activeIds = new Set(monthRecords.filter(r => !r.falta).map(r => r.employeeId));
  const faltas = monthRecords.filter(r => r.falta).length;

  // Dias úteis no mês até hoje (ou até o último dia, se já for mês passado/futuro)
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const today = new Date(TODAY);
  const sameMonth = currentMonth.getFullYear() === today.getFullYear() &&
                    currentMonth.getMonth() === today.getMonth();
  const lastDay = sameMonth ? today : monthEnd;
  let workingDays = 0;
  for (let dt = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
       dt <= lastDay; dt.setDate(dt.getDate() + 1)) {
    if (!isWeekend(dt)) workingDays++;
  }

  const navMonth = (delta) => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + delta);
    setCurrentMonth(d);
  };

  return (
    <div className="vale-screen" style={{ padding: '0 20px' }}>
      <div className="vale-month-picker">
        <button className="vale-icon-btn" onClick={() => navMonth(-1)} aria-label="Mês anterior">
          <IconChevronLeft size={18}/>
        </button>
        <div className="vale-month-name">{monthName}</div>
        <button className="vale-icon-btn" onClick={() => navMonth(1)} aria-label="Próximo mês">
          <IconChevronRight size={18}/>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        <div className="vale-card" style={{ padding: 14 }}>
          <div className="vale-stat-label">Horas</div>
          <div className="tabular" style={{
            fontSize: 18, fontWeight: 700, color: 'var(--ink)',
            marginTop: 4, letterSpacing: '-0.01em'
          }}>
            {minsToHuman(totalMins)}
          </div>
        </div>
        <div className="vale-card" style={{ padding: 14 }}>
          <div className="vale-stat-label">Ativos</div>
          <div className="tabular" style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>
            {activeIds.size}
            <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>/{employees.length}</span>
          </div>
        </div>
        <div className="vale-card" style={{ padding: 14 }}>
          <div className="vale-stat-label">Faltas</div>
          <div className="tabular" style={{
            fontSize: 18, fontWeight: 700,
            color: faltas > 0 ? 'var(--status-err-dot)' : 'var(--ink)',
            marginTop: 4
          }}>
            {faltas}
          </div>
        </div>
      </div>

      {employees.length === 0 ? (
        <EmptyState
          icon={IconCalendar}
          title="Nenhum funcionário cadastrado"
          body="Cadastre funcionários na aba Equipe para começar a registrar ponto."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {employees.map(e => {
            const empRecs = monthRecords.filter(r => r.employeeId === e.id);
            const daysWorked = empRecs.filter(r => !r.falta).length;
            const empMins = empRecs.reduce((s, r) => s + calcWorked(r), 0);
            const expectedMins = workingDays * STANDARD_HOURS_DAY * 60;
            const pct = expectedMins > 0 ? Math.min((empMins / expectedMins) * 100, 100) : 0;

            return (
              <button key={e.id}
                      onClick={() => onOpenEmployee(e.id)}
                      className="vale-card vale-card-clickable"
                      style={{ padding: 14, textAlign: 'left', width: '100%' }}>
                <div className="vale-row">
                  <Avatar nome={e.nome} size={44}/>
                  <div className="vale-grow">
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{e.nome}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{e.cargo}</div>
                  </div>
                  <IconChevronRight size={18} style={{ color: 'var(--subtle)' }}/>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div className="vale-progress">
                    <div className="vale-progress-fill" style={{ width: `${pct}%` }}/>
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginTop: 8, fontSize: 12
                  }}>
                    <span className="tabular" style={{ color: 'var(--muted)' }}>
                      {daysWorked} / {workingDays} dias
                    </span>
                    <span className="tabular" style={{ color: 'var(--ink)', fontWeight: 600 }}>
                      {minsToHuman(empMins)}
                      <span style={{ color: 'var(--muted)', fontWeight: 500 }}> / {expectedMins / 60}h</span>
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---------- Calendário 7-col ----------
export const PontoCalendar = ({ employee, ponto, monthDate, onDayClick, dir = 0 }) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();
  const today = new Date(TODAY);
  const todayKey = dateKey(today);

  const recs = ponto.filter(p => p.employeeId === employee.id);
  const recByDate = {};
  recs.forEach(r => { recByDate[r.date] = r; });

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ empty: true, key: 'e' + i });
  for (let d = 1; d <= lastDate; d++) {
    const date = new Date(year, month, d);
    const key = dateKey(date);
    const rec = recByDate[key];
    let kind = 'unrecorded';
    if (isWeekend(date)) kind = 'weekend';
    else if (rec) kind = rec.status;
    cells.push({ empty: false, key, day: d, date, kind, rec, isToday: key === todayKey });
  }

  const headers = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="vale-cal-anim" style={{ '--cal-dir': `${dir * 12}px` }}>
      <div className="vale-cal" style={{ marginBottom: 6 }}>
        {headers.map(h => (
          <div key={h} className="vale-cal-head">{h}</div>
        ))}
      </div>
      <div className="vale-cal">
        {cells.map(c => c.empty ? (
          <div key={c.key} className="vale-cal-cell empty"/>
        ) : (
          <div key={c.key}
               className={`vale-cal-cell ${c.kind} ${c.isToday ? 'today' : ''}`}
               onClick={() => onDayClick && onDayClick(c)}>
            {c.day}
            {c.rec && !c.rec.falta && (
              <div className="vale-cal-cell-hour">{minsToHuman(calcWorked(c.rec))}</div>
            )}
            {c.rec && c.rec.falta && (
              <div className="vale-cal-cell-hour">F</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const PontoCalendarLegend = () => (
  <div className="vale-cal-legend">
    <div className="vale-cal-legend-item">
      <div className="vale-cal-legend-dot" style={{ background: 'var(--status-ok-bg)' }}/>
      Completo
    </div>
    <div className="vale-cal-legend-item">
      <div className="vale-cal-legend-dot" style={{ background: 'var(--status-warn-bg)' }}/>
      Incompleto
    </div>
    <div className="vale-cal-legend-item">
      <div className="vale-cal-legend-dot" style={{ background: 'var(--status-err-bg)' }}/>
      Falta
    </div>
    <div className="vale-cal-legend-item">
      <div className="vale-cal-legend-dot" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}/>
      Não registrado
    </div>
    <div className="vale-cal-legend-item">
      <div className="vale-cal-legend-dot" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}/>
      Fim de semana
    </div>
  </div>
);

// ---------- Detalhe de Ponto ----------
export const PontoDetail = ({ employee, ponto, onBack, onDayClick }) => {
  const today = new Date(TODAY);
  const [monthDate, setMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [dir, setDir] = useState(0);
  const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const monthRecs = ponto.filter(p => {
    if (p.employeeId !== employee.id) return false;
    const d = new Date(p.date + 'T12:00:00');
    return d.getMonth() === monthDate.getMonth() && d.getFullYear() === monthDate.getFullYear();
  });
  const totalMins = monthRecs.reduce((s, r) => s + calcWorked(r), 0);
  const monthFaltas = monthRecs.filter(r => r.falta).length;

  const navMonth = (delta) => {
    setDir(delta);
    const d = new Date(monthDate);
    d.setMonth(d.getMonth() + delta);
    setMonthDate(d);
  };

  return (
    <div className="vale-screen">
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--line)',
        padding: '8px 20px 24px'
      }}>
        <div style={{ marginBottom: 16 }}>
          <button className="vale-icon-btn vale-icon-btn-ghost" onClick={onBack} aria-label="Voltar">
            <IconChevronLeft size={20}/>
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar nome={employee.nome} size={64} ring/>
          <div>
            <div style={{
              fontSize: 20, fontWeight: 700, color: 'var(--ink)',
              letterSpacing: '-0.01em'
            }}>{employee.nome}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
              {employee.cargo} · {employee.setor}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div className="vale-month-picker">
          <button className="vale-icon-btn" onClick={() => navMonth(-1)} aria-label="Mês anterior">
            <IconChevronLeft size={18}/>
          </button>
          <div className="vale-month-name">{monthName}</div>
          <button className="vale-icon-btn" onClick={() => navMonth(1)} aria-label="Próximo mês">
            <IconChevronRight size={18}/>
          </button>
        </div>

        {monthRecs.length === 0 && (
          <EmptyState
            icon={IconCalendar}
            title="Nenhum ponto registrado neste mês"
            body="Toque em um dia abaixo para começar a registrar."
          />
        )}

        <PontoCalendar
          key={monthDate.toISOString()}
          employee={employee}
          ponto={ponto}
          monthDate={monthDate}
          dir={dir}
          onDayClick={(c) => {
            if (c.kind === 'weekend') return;
            onDayClick(c.date, c.rec);
          }}
        />

        <PontoCalendarLegend/>

        <div className="vale-card" style={{ padding: 16, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="vale-stat-label">Total no mês</div>
              <div className="tabular" style={{
                fontSize: 22, fontWeight: 700, color: 'var(--ink)',
                letterSpacing: '-0.01em', marginTop: 4
              }}>
                {minsToHuman(totalMins)}
              </div>
            </div>
            {monthFaltas > 0 && (
              <div style={{ textAlign: 'right' }}>
                <div className="vale-stat-label">Faltas</div>
                <div className="tabular" style={{
                  fontSize: 22, fontWeight: 700,
                  color: 'var(--status-err-dot)', marginTop: 4
                }}>
                  {monthFaltas}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Bottom sheet de registro ----------
export const RegistroPonto = ({ employee, date, existing, onClose, onSave }) => {
  const [entrada, setEntrada]         = useState(existing?.entrada || '08:00');
  const [saidaAlmoco, setSaidaAlmoco] = useState(existing?.saidaAlmoco || '12:00');
  const [voltaAlmoco, setVoltaAlmoco] = useState(existing?.voltaAlmoco || '13:00');
  const [saida, setSaida]             = useState(existing?.saida || '17:00');
  const [falta, setFalta]             = useState(!!existing?.falta);
  const [motivo, setMotivo]           = useState(existing?.motivo || '');
  const [obs, setObs]                 = useState(existing?.obs || '');
  const toast = useToast();

  const errors = {};
  if (!falta) {
    if (!entrada) errors.entrada = 'Obrigatório';
    if (!saida)   errors.saida = 'Obrigatório';
    if (entrada && saida && timeToMins(saida) <= timeToMins(entrada)) {
      errors.saida = 'Saída deve ser após a entrada';
    }
    if (saidaAlmoco && voltaAlmoco && timeToMins(voltaAlmoco) <= timeToMins(saidaAlmoco)) {
      errors.voltaAlmoco = 'Volta deve ser após a saída do almoço';
    }
  }

  const total = falta ? 0 : calcWorked({ entrada, saidaAlmoco, voltaAlmoco, saida });
  const canSave = Object.keys(errors).length === 0 && (!falta || motivo.trim().length > 0);

  const dateLong = date.toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });

  const handleSave = () => {
    const rec = {
      id: existing?.id || `p_${employee.id}_${dateKey(date)}`,
      employeeId: employee.id,
      date: dateKey(date),
      falta,
      ...(falta
        ? { motivo, status: 'absent' }
        : {
            entrada, saidaAlmoco, voltaAlmoco, saida,
            status: total >= STANDARD_HOURS_DAY * 60 ? 'complete' : 'partial'
          }),
      obs: obs.trim()
    };
    onSave(rec);
    toast(`Ponto de ${dateLong.split(',')[0]} salvo`, 'success');
    onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>
      <div style={{ padding: '4px 20px 12px' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Registro de</div>
        <h3 style={{
          margin: '2px 0 0', fontSize: 18, fontWeight: 700, color: 'var(--ink)',
          textTransform: 'capitalize'
        }}>
          {dateLong}
        </h3>
      </div>

      <div className="vale-row" style={{ padding: '0 20px 16px', gap: 10 }}>
        <Avatar nome={employee.nome} size={40}/>
        <div>
          <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 14 }}>{employee.nome}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{employee.cargo}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 8px' }}>
        <button
          onClick={() => setFalta(!falta)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            padding: '12px 14px', borderRadius: 8,
            border: '1px solid var(--line)',
            background: falta ? 'var(--status-err-bg)' : 'var(--surface)',
            marginBottom: 16, cursor: 'pointer', textAlign: 'left'
          }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontWeight: 600, fontSize: 14,
              color: falta ? 'var(--status-err-fg)' : 'var(--ink)'
            }}>
              Marcar como falta
            </div>
            <div style={{
              fontSize: 12,
              color: falta ? 'var(--status-err-fg)' : 'var(--muted)',
              marginTop: 2
            }}>
              {falta ? 'Dia será contabilizado como ausência' : 'Funcionário não compareceu'}
            </div>
          </div>
          <div style={{
            width: 36, height: 22, borderRadius: 999,
            background: falta ? 'var(--status-err-dot)' : 'var(--line)',
            position: 'relative', transition: 'background 200ms ease', flexShrink: 0
          }}>
            <div style={{
              position: 'absolute', top: 2, left: falta ? 16 : 2,
              width: 18, height: 18, borderRadius: 999,
              background: '#fff', transition: 'left 200ms ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}/>
          </div>
        </button>

        {falta ? (
          <div className="vale-field" style={{ marginBottom: 12 }}>
            <label className="vale-label">Motivo da falta</label>
            <select className="vale-input" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
              <option value="">Selecione…</option>
              <option value="Atestado médico">Atestado médico</option>
              <option value="Falta justificada">Falta justificada</option>
              <option value="Licença">Licença</option>
              <option value="Folga compensada">Folga compensada</option>
              <option value="Falta não justificada">Falta não justificada</option>
            </select>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="vale-field">
                <label className="vale-label">Entrada</label>
                <input type="time"
                       className={`vale-input ${errors.entrada ? 'error' : ''}`}
                       value={entrada} onChange={(e) => setEntrada(e.target.value)}/>
                {errors.entrada && <div className="vale-error">{errors.entrada}</div>}
              </div>
              <div className="vale-field">
                <label className="vale-label">Saída</label>
                <input type="time"
                       className={`vale-input ${errors.saida ? 'error' : ''}`}
                       value={saida} onChange={(e) => setSaida(e.target.value)}/>
                {errors.saida && <div className="vale-error">{errors.saida}</div>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div className="vale-field">
                <label className="vale-label">Saída almoço</label>
                <input type="time" className="vale-input"
                       value={saidaAlmoco} onChange={(e) => setSaidaAlmoco(e.target.value)}/>
              </div>
              <div className="vale-field">
                <label className="vale-label">Volta almoço</label>
                <input type="time"
                       className={`vale-input ${errors.voltaAlmoco ? 'error' : ''}`}
                       value={voltaAlmoco} onChange={(e) => setVoltaAlmoco(e.target.value)}/>
                {errors.voltaAlmoco && <div className="vale-error">{errors.voltaAlmoco}</div>}
              </div>
            </div>

            <div className="vale-card" style={{
              padding: 14, marginBottom: 16,
              background: 'var(--primary-50)',
              border: '1px solid var(--primary)'
            }}>
              <div className="vale-stat-label" style={{ color: 'var(--primary)' }}>Total trabalhado</div>
              <div className="tabular" style={{
                fontSize: 24, fontWeight: 700,
                color: 'var(--primary)', marginTop: 2,
                letterSpacing: '-0.01em'
              }}>
                {minsToHuman(total)}
              </div>
            </div>
          </>
        )}

        <div className="vale-field" style={{ marginBottom: 12 }}>
          <label className="vale-label">Observação (opcional)</label>
          <textarea className="vale-input vale-textarea"
                    placeholder="Notas adicionais…"
                    value={obs} onChange={(e) => setObs(e.target.value)}
                    maxLength={200}/>
        </div>
      </div>

      <div className="vale-form-footer" style={{ display: 'flex', gap: 8 }}>
        <button className="vale-btn vale-btn-ghost" onClick={onClose} style={{ flex: 1 }}>
          Cancelar
        </button>
        <button className="vale-btn vale-btn-primary"
                disabled={!canSave}
                onClick={handleSave} style={{ flex: 2 }}>
          Salvar
        </button>
      </div>
    </div>
  );
};

// ---------- Mini-stats de ponto p/ aba do perfil ----------
export const PontoStatsForEmployee = ({ employee, ponto }) => {
  const today = new Date(TODAY);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const monthRecs = ponto.filter(p => {
    if (p.employeeId !== employee.id) return false;
    const d = new Date(p.date + 'T12:00:00');
    return d >= monthStart && d <= today;
  });
  const totalMins = monthRecs.reduce((s, r) => s + calcWorked(r), 0);
  const faltas = monthRecs.filter(r => r.falta).length;
  const partial = monthRecs.filter(r => r.status === 'partial').length;

  // Hora média de entrada
  const entradas = monthRecs.filter(r => r.entrada).map(r => timeToMins(r.entrada));
  const avgEntrada = entradas.length
    ? Math.round(entradas.reduce((a, b) => a + b, 0) / entradas.length)
    : null;
  const avgEntradaFormatted = avgEntrada == null
    ? '—'
    : `${String(Math.floor(avgEntrada / 60)).padStart(2, '0')}:${String(avgEntrada % 60).padStart(2, '0')}`;

  return {
    totalMins,
    faltas,
    atrasos: partial,
    avgEntrada: avgEntradaFormatted
  };
};
