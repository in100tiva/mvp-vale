# Roadmap — Vale

## Marco Ativo

**v0.1 — Correção de tema escuro em mobile real**

Resolver o problema de auto-darkening do Chrome Android / Samsung Internet que está aplicando uma segunda transformação de cores sobre o CSS dark já implementado, deixando o app "feio e bugado" no celular real apesar de funcionar no DevTools mobile.

**Granularidade**: Coarse — 2 fases.
**Status**: Não iniciado (Fase 1 já tem fix parcial aplicado; falta finalizar e validar).

---

## Fases

| # | Fase | Goal | Requisitos | Critérios de Sucesso |
|---|------|------|------------|----------------------|
| 1 | Token-fy & sinalizar dark canônico | Eliminar todos os hardcodes light que vazam em dark e dar ao navegador o sinal canônico para não auto-darkenizar | THEME-01, THEME-02, THEME-03, THEME-05 | 4 |
| 1.1 | Persistência em localStorage (modo demo) | Permitir que o usuário interaja (criar/aprovar/negar pedidos, cadastrar funcionário) e que as ações sobrevivam a reload, sem backend | DEMO-01, DEMO-02 | 3 |
| 2 | Validação em mobile real | Confirmar que o fix elimina a discrepância entre DevTools e celular real em ≥ 2 navegadores | THEME-04 | 3 |
| 3 | Folha de Ponto + Dark estrito | Estender o MVP com folha de ponto completa (lista geral, calendário do funcionário, registro, abas no perfil, cards no dashboard) E tornar dark o tema absoluto do app | PONTO-01..09, THEME-DARK-01, THEME-DARK-02 | 6 |

---

## Phase Details

### Phase 1 — Token-fy & sinalizar dark canônico

**Goal**: Toda cor com semântica de "superfície clara" passa a vir de token (`--surface`, `--bg`, `--ink`, `--primary` etc.) em vez de literal. Adicionar `color-scheme: dark` no media query dark e meta tags de tema. Garantir que o gradiente do hero use o token `--primary` para que dark mode ganhe a versão teal vibrante (`#14B8A6`) em vez do verde-escuro `#0F766E`.

**Files in scope:**
- `index.html` — meta `color-scheme` (já feito) e `theme-color` (já feito)
- `src/styles.css` — `color-scheme: dark` no media query dark (já feito), `html { background }` em dark (já feito), bottom-nav usando `--surface` (já feito), hardcodes restantes (`#CBD5E1`, etc — já feito)
- `src/screens.jsx` — gradiente teal do hero (linha 55), barras de frequência (linha 76), avatares hardcoded (linha 153)
- `src/forms.jsx` — hardcode `#FEE2E2` linha 485 (status negado) — manter já que é semântico, mas conferir contraste em dark
- `src/ui.jsx` — toasts (linhas 68) — `#EF4444` e `#10B981` são tokens semânticos OK, manter

**Requisitos cobertos:** THEME-01, THEME-02, THEME-03, THEME-05

**Critérios de sucesso (observáveis):**
1. `grep -rE "#FFF|#fff|rgba\(255,255,255" src/` retorna 0 ocorrências em contextos de superfície (excluído `color: '#fff'` sobre fundo primary que é proposital).
2. Hero "TOTAL PEDIDO EM MAIO" usa `linear-gradient` com `var(--primary)` e em dark mode mostra teal vibrante (`#14B8A6`), não verde-escuro.
3. `index.html` tem `<meta name="theme-color">` para light e dark; `styles.css` declara `color-scheme: dark` dentro de `@media (prefers-color-scheme: dark)`.
4. `npm run build` passa sem erros e sem warnings de CSS.

**UI hint**: yes (essa fase mexe em estilos visíveis)

---

### Phase 1.1 — Persistência em localStorage (modo demo)

**Goal**: Tornar o MVP genuinamente demonstrável sem backend. Pedidos criados, aprovações/negações e funcionários cadastrados persistem entre reloads no mesmo dispositivo. Sem auth, sem banco — só `localStorage` com seed dos mocks de `data.js` na primeira execução.

**Files in scope:**
- `src/useLocalStorage.js` — hook reutilizável com lazy init, fallback gracioso (SSR/modo anônimo) e `resetValeStorage()` para limpar tudo
- `src/App.jsx` — substituir `useState(INITIAL_*)` por `useLocalStorage('employees', …)` e `useLocalStorage('requests', …)`. Adicionar botão "Resetar dados de demonstração" na tela "Eu" (perfil)

**Requisitos cobertos:** DEMO-01, DEMO-02

**Critérios de sucesso:**
1. Reload da página preserva pedidos novos, mudanças de status e funcionários cadastrados.
2. Botão de reset na tela de perfil restaura o seed inicial após confirmação (`window.confirm`).
3. App não quebra em ambientes onde `localStorage` está bloqueado (modo privativo restrito) — cai para in-memory silenciosamente.

**UI hint**: yes (botão de reset visível)

---

### Phase 2 — Validação em mobile real

**Goal**: Confirmar empiricamente que o app, depois da Fase 1, renderiza idêntico no celular real e no DevTools mobile, em modo escuro do sistema. Sem essa validação o marco não fecha — é o ponto inteiro do bug.

**Files in scope:**
- Nenhum código novo. Apenas execução, captura de evidências e atualização do `STATE.md` + `PROJECT.md` (Validated).
- Build local servido via `npm run dev` ou deploy preview na Vercel.

**Requisitos cobertos:** THEME-04

**Critérios de sucesso:**
1. Screenshots lado a lado: celular real × DevTools mobile (mesma viewport) — diferença visual mínima, sem washout de cards nem perda de saturação no gradiente.
2. Testado em ≥ 2 navegadores mobile (mínimo: Chrome Android + Samsung Internet, Firefox Android se disponível).
3. Documentado no `STATE.md` qual era o comportamento "antes" e "depois", anexando os prints fornecidos pelo usuário.

**UI hint**: yes (validação visual)

---

### Phase 3 — Folha de Ponto + Dark estrito

**Goal**: Adicionar funcionalidade completa de folha de ponto (modelo "gestor registra") reaproveitando o cadastro de funcionários existente. Tornar dark o tema absoluto, eliminando a chance do navegador aplicar Auto Dark Theme.

**Files in scope:**
- `src/data.js` — helpers de tempo (`pad`, `dateKey`, `isWeekend`, `timeToMins`, `minsToTime`, `minsToHuman`, `calcWorked`), constante `STANDARD_HOURS_DAY`, gerador determinístico `generatePonto()` e `INITIAL_PONTO` (30 dias úteis × 10 funcionários)
- `src/icons.jsx` — `IconDollar`, `IconSun`, `IconMoon`, `IconAlert`
- `src/ponto.jsx` (novo) — `PontoList`, `PontoCalendar`, `PontoCalendarLegend`, `PontoDetail`, `RegistroPonto`
- `src/screens.jsx` — Dashboard ganha 2 cards (pontos pendentes hoje + faltas no mês com delta), `PerfilFuncionario` ganha abas Vales/Ponto e `PerfilPontoTab` (mini-stats + calendário)
- `src/App.jsx` — NAV trocando "Eu" por "Ponto", avatar clicável no topbar, sidebar com Ponto, FAB speed-dial (Novo vale + Registrar ponto), rotas `ponto` e `ponto-emp`, persistência `useLocalStorage('ponto', INITIAL_PONTO)`, sheet do `RegistroPonto`
- `src/styles.css` — dark default absoluto (light só via `[data-theme="light"]`), tokens `--surface-2` e `--status-*`, classes `.vale-month-picker`, `.vale-progress*`, `.vale-cal*` (calendário 7-col com cores semânticas), `.vale-tabs/.vale-tab` (underline tabs), `.vale-error`/`.vale-input.error`, `.vale-fab-menu*` (speed-dial)
- `index.html` — `color-scheme: dark` (sem light), `theme-color: #0B1120`

**Requisitos cobertos:** PONTO-01..09, THEME-DARK-01, THEME-DARK-02

**Critérios de sucesso (observáveis):**
1. Bottom nav (BubbleNav) mantém visual atual mas com itens Home/Pedidos/Ponto/Equipe; tap em Ponto abre lista mensal; tap em card de funcionário abre detalhe com calendário.
2. FAB no dashboard, ao tocar, anima para mostrar "Novo vale" e "Registrar ponto"; backdrop escurece o fundo; tap fora ou no X fecha.
3. Calendário do funcionário renderiza dias com cores semânticas corretas, dia atual com outline primário, weekends esmaecidos, tap em dia útil abre bottom sheet com formulário; navegação de mês via setas com slide animado.
4. Bottom sheet de registro: time pickers nativos no mobile, total trabalhado em card destacado atualiza ao vivo, toggle falta esconde campos de hora e mostra select de motivo, validações inline em vermelho.
5. Dashboard mostra os 2 cards novos com números corretos a partir do `INITIAL_PONTO`; clique em qualquer dos 2 navega para a aba Ponto.
6. `npm run build` passa sem erros e sem warnings novos. Mocks de ponto não regeneram a cada reload (geração determinística por seed).

**UI hint**: yes (telas inteiramente novas + mudanças de navegação + tema)

---

## Próximos marcos (backlog estratégico)

- v0.2 — Toggle manual claro/escuro (persistente em localStorage, lê/grava `data-theme` no `<html>`)
- v0.3 — Backend real (Supabase já listado como MCP) + autenticação
- v0.4 — Notificações push para gestora quando novo pedido entra
- v0.5 — Exportação de folha de ponto (CSV/PDF) e fechamento mensal

---
*Last updated: 2026-05-04 after initialization*
