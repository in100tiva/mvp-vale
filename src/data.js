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
  pendente: { label: 'Pendente', bg: '#FEF3C7', fg: '#92400E', dot: '#F59E0B' },
  aprovado: { label: 'Aprovado', bg: '#D1FAE5', fg: '#065F46', dot: '#10B981' },
  pago:     { label: 'Pago',     bg: '#DBEAFE', fg: '#1E40AF', dot: '#3B82F6' },
  negado:   { label: 'Negado',   bg: '#FEE2E2', fg: '#991B1B', dot: '#EF4444' }
};
