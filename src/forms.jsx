import { useState, useRef, useEffect } from 'react';
import { TODAY, fmtBRL, fmtDateLong, SETORES, CARGOS, STATUS_META } from './data.js';
import {
  IconChevronLeft, IconChevronRight, IconX, IconCheck, IconSearch,
  IconUsers, IconSparkles, IconBell, IconCalendar, IconWallet
} from './icons.jsx';
import { Avatar, StatusBadge, EmptyState, useToast } from './ui.jsx';

// Currency input with BRL mask
const CurrencyInput = ({ value, onChange, autoFocus }) => {
  const cents = Math.round(value * 100);
  const display = (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
  const ref = useRef(null);
  useEffect(() => { if (autoFocus && ref.current) ref.current.focus(); }, [autoFocus]);

  const onKey = (e) => {
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      const next = cents * 10 + parseInt(e.key, 10);
      if (next > 99999999) return;
      onChange(next / 100);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      onChange(Math.floor(cents / 10) / 100);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'baseline',
      padding: '24px 0',
      justifyContent: 'center'
    }}>
      <span style={{ fontSize: 28, fontWeight: 600, color: 'var(--muted)', marginRight: 6 }}>R$</span>
      <input
        ref={ref}
        readOnly
        inputMode="numeric"
        className="tabular"
        value={display}
        onKeyDown={onKey}
        style={{
          fontSize: 56, fontWeight: 700,
          color: cents > 0 ? 'var(--ink)' : 'var(--subtle)',
          background: 'transparent', border: 'none', outline: 'none',
          width: `${Math.max(display.length + 1, 5)}ch`,
          textAlign: 'center', letterSpacing: '-0.02em',
          caretColor: 'var(--primary)'
        }}
      />
    </div>
  );
};

// Numeric pad (mobile)
const NumericPad = ({ onPress }) => {
  const keys = [['1','2','3'],['4','5','6'],['7','8','9'],['.','0','⌫']];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      padding: '16px 20px'
    }}>
      {keys.flat().map((k) => (
        <button key={k}
          onClick={() => onPress(k)}
          style={{
            height: 56, borderRadius: 12,
            background: 'var(--surface)', border: '1px solid var(--line)',
            fontSize: 22, fontWeight: 600, color: 'var(--ink)',
            transition: 'background 120ms ease, transform 100ms ease',
            fontFamily: 'inherit'
          }}
          onMouseDown={(e) => e.currentTarget.style.background = 'var(--line-soft)'}
          onMouseUp={(e) => e.currentTarget.style.background = 'var(--surface)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'var(--surface)'}>
          {k}
        </button>
      ))}
    </div>
  );
};

export const NovoPedido = ({ employees, onClose, onSave, prefilledEmployeeId }) => {
  const [step, setStep] = useState(prefilledEmployeeId ? 1 : 0);
  const [employeeId, setEmployeeId] = useState(prefilledEmployeeId || null);
  const [valor, setValor] = useState(0);
  const [data, setData] = useState(new Date(TODAY).toISOString().slice(0, 10));
  const [obs, setObs] = useState('');
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const employee = employees.find(e => e.id === employeeId);
  const filteredEmps = employees.filter(e =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  const next = () => setStep(s => Math.min(s + 1, 3));
  const prev = () => step === 0 ? onClose() : setStep(s => s - 1);

  const handlePadPress = (k) => {
    const cents = Math.round(valor * 100);
    if (k === '⌫') setValor(Math.floor(cents / 10) / 100);
    else if (k === '.') {}
    else {
      const next = cents * 10 + parseInt(k, 10);
      if (next > 99999999) return;
      setValor(next / 100);
    }
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave({
        id: 'r' + Math.random().toString(36).slice(2, 8),
        employeeId,
        valor,
        data: new Date(data + 'T12:00:00').toISOString(),
        status: 'pendente',
        obs: obs.trim()
      });
      toast(`Vale de ${fmtBRL(valor)} criado para ${employee.nome}`, 'success');
      onClose();
      setSaving(false);
    }, 600);
  };

  const canNext = step === 0 ? !!employeeId : step === 1 ? valor > 0 : step === 2 ? !!data : true;
  const stepTitles = ['Para quem é o vale?', 'Qual o valor?', 'Data e observação', 'Confirmar pedido'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 540 }}>
      <div style={{
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--line)'
      }}>
        <button className="vale-icon-btn vale-icon-btn-ghost" onClick={prev}>
          <IconChevronLeft size={20}/>
        </button>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)' }}>
          Etapa {step + 1} de 4
        </div>
        <button className="vale-icon-btn vale-icon-btn-ghost" onClick={onClose} aria-label="Cancelar">
          <IconX size={18}/>
        </button>
      </div>

      <div style={{ padding: '8px 20px 0', display: 'flex', gap: 4 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= step ? 'var(--primary)' : 'var(--line)',
            transition: 'background 220ms ease'
          }}/>
        ))}
      </div>

      <div style={{ padding: '20px 20px 8px' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--ink)',
                    letterSpacing: '-0.01em' }}>
          {stepTitles[step]}
        </h2>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 0 16px' }}>
        {step === 0 && (
          <div style={{ padding: '0 20px' }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <IconSearch size={18} style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--subtle)'
              }}/>
              <input className="vale-input" style={{ paddingLeft: 42 }}
                     placeholder="Buscar por nome…"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     autoFocus/>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {filteredEmps.map(e => (
                <button key={e.id}
                        onClick={() => setEmployeeId(e.id)}
                        className="vale-row"
                        style={{
                          padding: 10, borderRadius: 10, width: '100%', textAlign: 'left',
                          background: employeeId === e.id ? 'var(--primary-50)' : 'transparent',
                          border: employeeId === e.id ? '1px solid var(--primary)' : '1px solid transparent'
                        }}>
                  <Avatar nome={e.nome} size={40}/>
                  <div className="vale-grow">
                    <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 14 }}>{e.nome}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{e.cargo}</div>
                  </div>
                  {employeeId === e.id && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)',
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}><IconCheck size={14}/></div>
                  )}
                </button>
              ))}
              {filteredEmps.length === 0 && (
                <EmptyState icon={IconUsers} title="Sem resultados"/>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            {employee && (
              <div className="vale-row" style={{ padding: '0 20px 8px', gap: 8 }}>
                <Avatar nome={employee.nome} size={28}/>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  Para <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{employee.nome}</span>
                </div>
              </div>
            )}
            <CurrencyInput value={valor} onChange={setValor} autoFocus/>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap',
                         padding: '0 20px 8px' }}>
              {[200, 500, 1000, 1500].map(v => (
                <button key={v}
                        onClick={() => setValor(v)}
                        className="vale-chip">
                  {fmtBRL(v)}
                </button>
              ))}
            </div>
            <NumericPad onPress={handlePadPress}/>
          </div>
        )}

        {step === 2 && (
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="vale-field">
              <label className="vale-label">Data do pedido</label>
              <input type="date" className="vale-input"
                     value={data} onChange={(e) => setData(e.target.value)}/>
            </div>
            <div className="vale-field">
              <label className="vale-label">Observação (opcional)</label>
              <textarea className="vale-input vale-textarea"
                        placeholder="Ex: Despesa médica, conta de luz…"
                        value={obs}
                        onChange={(e) => setObs(e.target.value)}
                        maxLength={200}/>
              <div style={{ fontSize: 11, color: 'var(--subtle)', textAlign: 'right' }}>
                {obs.length}/200
              </div>
            </div>
          </div>
        )}

        {step === 3 && employee && (
          <div style={{ padding: '0 20px' }}>
            <div className="vale-card" style={{ padding: 20, marginBottom: 16 }}>
              <div className="vale-row" style={{ marginBottom: 16 }}>
                <Avatar nome={employee.nome} size={48}/>
                <div className="vale-grow">
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{employee.nome}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{employee.cargo}</div>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: 16 }}>
                <div className="vale-stat-label" style={{ marginBottom: 4 }}>Valor</div>
                <div className="vale-stat-num-lg tabular" style={{ color: 'var(--primary)' }}>
                  {fmtBRL(valor)}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                <div>
                  <div className="vale-stat-label">Data</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
                    {fmtDateLong(data + 'T12:00:00')}
                  </div>
                </div>
                <div>
                  <div className="vale-stat-label">Status inicial</div>
                  <div style={{ marginTop: 4 }}>
                    <StatusBadge status="pendente" size="sm"/>
                  </div>
                </div>
              </div>
              {obs && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line-soft)' }}>
                  <div className="vale-stat-label" style={{ marginBottom: 6 }}>Observação</div>
                  <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{obs}</div>
                </div>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
              Após confirmar, o pedido entrará na fila de aprovação.
            </div>
          </div>
        )}
      </div>

      <div className="vale-form-footer">
        {step < 3 ? (
          <button className="vale-btn vale-btn-primary vale-btn-block"
                  disabled={!canNext}
                  onClick={next}>
            Continuar <IconChevronRight size={18}/>
          </button>
        ) : (
          <button className="vale-btn vale-btn-primary vale-btn-block"
                  disabled={saving}
                  onClick={handleSave}>
            {saving ? 'Salvando…' : <><span>Confirmar pedido</span> <IconCheck size={18}/></>}
          </button>
        )}
      </div>
    </div>
  );
};

// ---------- Cadastro funcionário ----------
export const NovoFuncionario = ({ onClose, onSave }) => {
  const [nome, setNome] = useState('');
  const [setor, setSetor] = useState(SETORES[0]);
  const [cargo, setCargo] = useState(CARGOS[SETORES[0]][0]);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setCargo(CARGOS[setor][0]);
  }, [setor]);

  const canSave = nome.trim().length >= 2;

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      onSave({
        id: 'e' + Math.random().toString(36).slice(2, 8),
        nome: nome.trim(),
        cargo,
        setor
      });
      toast(`${nome.trim()} cadastrado com sucesso`, 'success');
      onClose();
      setSaving(false);
    }, 500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 480 }}>
      <div style={{
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--line)'
      }}>
        <button className="vale-icon-btn vale-icon-btn-ghost" onClick={onClose}>
          <IconChevronLeft size={20}/>
        </button>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Novo funcionário</div>
        <div style={{ width: 40 }}/>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
                     gap: 10, padding: '12px 0 24px' }}>
          <Avatar nome={nome.trim() || 'Novo'} size={80} ring/>
          <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex',
                       alignItems: 'center', gap: 6 }}>
            <IconSparkles size={12}/> Avatar gerado a partir do nome
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="vale-field">
            <label className="vale-label">Nome completo</label>
            <input className="vale-input"
                   placeholder="Ex: Mariana Lopes"
                   value={nome}
                   onChange={(e) => setNome(e.target.value)}
                   autoFocus/>
          </div>

          <div className="vale-field">
            <label className="vale-label">Setor</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SETORES.map(s => (
                <button key={s}
                        onClick={() => setSetor(s)}
                        className="vale-chip"
                        style={{
                          padding: '10px 8px', fontSize: 12,
                          background: setor === s ? 'var(--primary-50)' : 'var(--surface)',
                          borderColor: setor === s ? 'var(--primary)' : 'var(--line)',
                          color: setor === s ? 'var(--primary)' : 'var(--text)',
                          fontWeight: setor === s ? 600 : 500
                        }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="vale-field">
            <label className="vale-label">Cargo</label>
            <select className="vale-input" value={cargo}
                    onChange={(e) => setCargo(e.target.value)}>
              {CARGOS[setor].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="vale-form-footer">
        <button className="vale-btn vale-btn-primary vale-btn-block"
                disabled={!canSave || saving}
                onClick={handleSave}>
          {saving ? 'Salvando…' : 'Cadastrar funcionário'}
        </button>
      </div>
    </div>
  );
};

// ---------- Request detail (sheet) ----------
export const RequestDetail = ({ request, employee, onClose, onUpdateStatus, onOpenEmployee }) => {
  if (!request || !employee) return null;
  const transitions = {
    pendente: [['aprovado', 'Aprovar'], ['negado', 'Negar']],
    aprovado: [['pago', 'Marcar como pago']],
    pago: [],
    negado: []
  };
  return (
    <div style={{ padding: '0 20px 20px' }}>
      <button onClick={() => onOpenEmployee(employee.id)}
              className="vale-row"
              style={{ padding: '8px 0 16px', textAlign: 'left', width: '100%' }}>
        <Avatar nome={employee.nome} size={48}/>
        <div className="vale-grow">
          <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{employee.nome}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>{employee.cargo} · {employee.setor}</div>
        </div>
        <IconChevronRight size={18} style={{ color: 'var(--subtle)' }}/>
      </button>

      <div style={{
        background: 'var(--primary-50)', borderRadius: 12, padding: 20, textAlign: 'center',
        marginBottom: 16
      }}>
        <div className="vale-stat-label" style={{ marginBottom: 4 }}>Valor solicitado</div>
        <div className="vale-stat-num-lg tabular" style={{ color: 'var(--primary)' }}>
          {fmtBRL(request.valor)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <div className="vale-stat-label">Data</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
            {fmtDateLong(request.data)}
          </div>
        </div>
        <div>
          <div className="vale-stat-label">Status</div>
          <div style={{ marginTop: 4 }}><StatusBadge status={request.status} size="sm"/></div>
        </div>
      </div>

      {request.obs && (
        <div className="vale-card" style={{ padding: 14, marginBottom: 16 }}>
          <div className="vale-stat-label" style={{ marginBottom: 6 }}>Observação</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>{request.obs}</div>
        </div>
      )}

      {transitions[request.status].length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transitions[request.status].map(([s, label]) => (
            <button key={s}
                    onClick={() => { onUpdateStatus(request.id, s); onClose(); }}
                    className="vale-btn vale-btn-block"
                    style={{
                      background: s === 'negado' ? '#FEE2E2' : 'var(--primary)',
                      color: s === 'negado' ? '#991B1B' : '#fff'
                    }}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
