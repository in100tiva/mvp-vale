export const SETORES = ['Operações', 'Comercial', 'Financeiro', 'Logística', 'Atendimento', 'TI'];

export const CARGOS = {
  'Operações': ['Operador', 'Supervisor', 'Coordenador'],
  'Comercial': ['Vendedor', 'Consultor', 'Gerente Comercial'],
  'Financeiro': ['Analista Financeiro', 'Assistente', 'Contador'],
  'Logística': ['Auxiliar Logístico', 'Motorista', 'Conferente'],
  'Atendimento': ['Atendente', 'SAC', 'Supervisor de Atendimento'],
  'TI': ['Desenvolvedor', 'Analista de Sistemas', 'Suporte TI']
};

export const INITIAL_EMPLOYEES = [
  { id: 'e1',  nome: 'Ana Silva',         cargo: 'Analista Financeiro', setor: 'Financeiro' },
  { id: 'e2',  nome: 'Carlos Mendes',     cargo: 'Vendedor',             setor: 'Comercial' },
  { id: 'e3',  nome: 'Juliana Costa',     cargo: 'Coordenadora',         setor: 'Operações' },
  { id: 'e4',  nome: 'Rafael Oliveira',   cargo: 'Motorista',            setor: 'Logística' },
  { id: 'e5',  nome: 'Beatriz Almeida',   cargo: 'Atendente',            setor: 'Atendimento' },
  { id: 'e6',  nome: 'Lucas Pereira',     cargo: 'Desenvolvedor',        setor: 'TI' },
  { id: 'e7',  nome: 'Fernanda Souza',    cargo: 'Supervisora',          setor: 'Operações' },
  { id: 'e8',  nome: 'Marcos Ribeiro',    cargo: 'Consultor',            setor: 'Comercial' },
  { id: 'e9',  nome: 'Patrícia Nogueira', cargo: 'Assistente',           setor: 'Financeiro' },
  { id: 'e10', nome: 'Diego Fernandes',   cargo: 'Conferente',           setor: 'Logística' }
];

export const TODAY = new Date(2026, 4, 4); // May 4, 2026

function daysAgo(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const INITIAL_REQUESTS = [
  { id: 'r1',  employeeId: 'e1',  valor: 800,  data: daysAgo(1),  status: 'pendente', obs: 'Despesa médica' },
  { id: 'r2',  employeeId: 'e3',  valor: 1200, data: daysAgo(2),  status: 'pendente', obs: '' },
  { id: 'r3',  employeeId: 'e2',  valor: 500,  data: daysAgo(3),  status: 'aprovado', obs: '' },
  { id: 'r4',  employeeId: 'e5',  valor: 350,  data: daysAgo(4),  status: 'pago',     obs: 'Conta de luz' },
  { id: 'r5',  employeeId: 'e3',  valor: 950,  data: daysAgo(6),  status: 'aprovado', obs: '' },
  { id: 'r6',  employeeId: 'e7',  valor: 600,  data: daysAgo(8),  status: 'pago',     obs: '' },
  { id: 'r7',  employeeId: 'e4',  valor: 450,  data: daysAgo(10), status: 'negado',   obs: 'Limite mensal atingido' },
  { id: 'r8',  employeeId: 'e3',  valor: 700,  data: daysAgo(12), status: 'pago',     obs: '' },
  { id: 'r9',  employeeId: 'e6',  valor: 1500, data: daysAgo(14), status: 'pago',     obs: 'Mudança' },
  { id: 'r10', employeeId: 'e2',  valor: 300,  data: daysAgo(16), status: 'pago',     obs: '' },
  { id: 'r11', employeeId: 'e8',  valor: 850,  data: daysAgo(18), status: 'pago',     obs: '' },
  { id: 'r12', employeeId: 'e1',  valor: 400,  data: daysAgo(22), status: 'pago',     obs: '' },
  { id: 'r13', employeeId: 'e2',  valor: 250,  data: daysAgo(25), status: 'pago',     obs: '' },
  { id: 'r14', employeeId: 'e9',  valor: 1100, data: daysAgo(28), status: 'pago',     obs: 'Material escolar' },
  { id: 'r15', employeeId: 'e3',  valor: 500,  data: daysAgo(33), status: 'pago',     obs: '' },
  { id: 'r16', employeeId: 'e10', valor: 200,  data: daysAgo(38), status: 'pago',     obs: '' },
  { id: 'r17', employeeId: 'e7',  valor: 750,  data: daysAgo(45), status: 'pago',     obs: '' },
  { id: 'r18', employeeId: 'e2',  valor: 600,  data: daysAgo(52), status: 'negado',   obs: 'Documentação pendente' }
];

export const avatarUrl = (nome) =>
  `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${encodeURIComponent(nome)}`;

export const fmtBRL = (n) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

export const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

export const fmtDateLong = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

export const relativeTime = (iso) => {
  const d = new Date(iso);
  const diff = Math.floor((TODAY - d) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  if (diff < 30) return `${Math.floor(diff / 7)} sem atrás`;
  return `${Math.floor(diff / 30)} mês atrás`;
};

export const STATUS_META = {
  pendente: { label: 'Pendente', cls: 'status-warn', dot: '#F59E0B' },
  aprovado: { label: 'Aprovado', cls: 'status-ok',   dot: '#10B981' },
  pago:     { label: 'Pago',     cls: 'status-blue',  dot: '#3B82F6' },
  negado:   { label: 'Negado',   cls: 'status-red',   dot: '#EF4444' }
};

// =====================================================================
// Ponto (folha de ponto / timesheet)
// =====================================================================

export const STANDARD_HOURS_DAY = 8;

export const pad = (n) => String(n).padStart(2, '0');
export const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const isWeekend = (d) => { const w = d.getDay(); return w === 0 || w === 6; };

export const timeToMins = (t) => {
  if (!t) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

export const minsToTime = (m) => {
  if (m == null) return '';
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
};

export const minsToHuman = (m) => {
  if (!m || m <= 0) return '0h';
  const h = Math.floor(m / 60), mm = m % 60;
  return mm === 0 ? `${h}h` : `${h}h ${pad(mm)}min`;
};

export const calcWorked = (rec) => {
  if (!rec || rec.falta) return 0;
  const e = timeToMins(rec.entrada);
  const s = timeToMins(rec.saida);
  if (e == null || s == null) return 0;
  let total = s - e;
  const sa = timeToMins(rec.saidaAlmoco);
  const va = timeToMins(rec.voltaAlmoco);
  if (sa != null && va != null && va > sa) total -= (va - sa);
  return Math.max(total, 0);
};

// Gera registros de ponto realistas para os últimos 30 dias úteis de cada funcionário.
function generatePonto(employees) {
  // Determinístico-por-funcionário-e-dia para não regenerar a cada reload.
  const hash = (s) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return ((h >>> 0) % 10000) / 10000;
  };
  const records = [];
  const today = new Date(TODAY);
  for (const emp of employees) {
    for (let i = 30; i >= 1; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (isWeekend(d)) continue;

      const seed = `${emp.id}|${dateKey(d)}`;
      const r = hash(seed);
      const id = `p_${emp.id}_${dateKey(d)}`;

      // 70% completo, 15% parcial, 10% sem registro, 5% falta
      if (r < 0.70) {
        const r2 = hash(seed + '|h');
        const entradaH = 8 + (r2 < 0.5 ? 0 : 1);
        const entradaM = Math.floor(hash(seed + '|em') * 30);
        const saidaH = 17 + (hash(seed + '|sh') < 0.4 ? 1 : 0);
        const saidaM = Math.floor(hash(seed + '|sm') * 30);
        records.push({
          id, employeeId: emp.id, date: dateKey(d),
          entrada: `${pad(entradaH)}:${pad(entradaM)}`,
          saidaAlmoco: '12:00',
          voltaAlmoco: '13:00',
          saida: `${pad(saidaH)}:${pad(saidaM)}`,
          falta: false, status: 'complete', obs: ''
        });
      } else if (r < 0.85) {
        const late = hash(seed + '|late') < 0.5;
        records.push({
          id, employeeId: emp.id, date: dateKey(d),
          entrada: late ? `09:${pad(20 + Math.floor(hash(seed + '|le') * 30))}`
                        : `08:${pad(Math.floor(hash(seed + '|ee') * 30))}`,
          saidaAlmoco: '12:00',
          voltaAlmoco: '13:00',
          saida: late ? `17:${pad(Math.floor(hash(seed + '|ls') * 30))}`
                      : `15:${pad(30 + Math.floor(hash(seed + '|es') * 30))}`,
          falta: false, status: 'partial', obs: ''
        });
      } else if (r < 0.95) {
        // sem registro — não adiciona record nenhum
        continue;
      } else {
        const motivos = ['Atestado médico', 'Falta justificada', 'Licença', 'Folga compensada'];
        records.push({
          id, employeeId: emp.id, date: dateKey(d),
          falta: true,
          motivo: motivos[Math.floor(hash(seed + '|m') * motivos.length)],
          status: 'absent', obs: ''
        });
      }
    }
  }
  return records;
}

export const INITIAL_PONTO = generatePonto(INITIAL_EMPLOYEES);
