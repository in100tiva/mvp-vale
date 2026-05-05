# Requirements — Vale

Marco atual: **v0.1 — Correção de tema escuro em mobile real**

## v1 Requirements

### Theme Robustness

- [ ] **THEME-01**: Em Chrome Android, Samsung Internet e Firefox Android com modo escuro do sistema ativado, o app renderiza com as MESMAS cores que aparecem no DevTools mobile do desktop (sem auto-darkening do navegador aplicando segunda transformação).
- [ ] **THEME-02**: Nenhum componente em `src/screens.jsx`, `src/forms.jsx`, `src/ui.jsx`, `src/BubbleNav.jsx` ou `src/styles.css` contém valores de cor hardcoded para light theme (`#fff`, `#FFFFFF`, `rgba(255,255,255,…)`, slates `#CBD5E1`/`#F1F5F9` etc.) que não derivem de tokens via `var(--…)` ou que não sejam neutros propositais (ex: branco sobre primary).
- [ ] **THEME-03**: O gradiente teal do hero "TOTAL PEDIDO EM MAIO" continua vibrante em dark real — usa o token `--primary` em vez de hex literal `#0F766E`/`#0D6963`, ou tem versão dark explícita.
- [ ] **THEME-04**: Smoke test visual passa em pelo menos 2 dispositivos/navegadores mobile reais — comparado lado a lado com DevTools mobile, sem diferença perceptível.
- [ ] **THEME-05**: `<meta name="color-scheme">` e `<meta name="theme-color">` declaram corretamente o suporte a dark, e a barra de status do navegador combina com o `--bg` do app.

### Demo Persistence (modo MVP sem backend)

- [ ] **DEMO-01**: Pedidos criados, aprovações/negações e funcionários cadastrados persistem entre reloads do navegador no mesmo dispositivo, sem nenhum backend.
- [ ] **DEMO-02**: Existe um botão "Resetar dados de demonstração" na tela "Eu" que restaura o seed mockado original após confirmação do usuário.

### Folha de Ponto (Phase 3)

- [ ] **PONTO-01**: Bottom nav mobile com 4 itens — Home, Pedidos, Ponto, Equipe. "Eu" sai do bottom nav e fica acessível via avatar clicável no topbar. Sidebar desktop ganha "Ponto" e mantém "Eu". Ícone Clock do Lucide para "Ponto".
- [ ] **PONTO-02**: FAB do dashboard vira speed-dial com 2 ações ao tocar — "Novo vale" (DollarSign) e "Registrar ponto" (Clock), com animação de expansão.
- [ ] **PONTO-03**: Tela "Lista de Ponto" com seletor de mês (setas + nome central), 3 mini-cards de stats (horas, ativos, faltas) e lista de funcionários — cada card com avatar, nome/cargo, barra de progresso (X/Y dias), indicador de horas (Xh/Yh) e chevron.
- [ ] **PONTO-04**: Tela "Detalhe de Ponto" reaproveita o header do perfil de funcionário, mostra calendário 7-col com cores semânticas (verde=completo, amarelo=incompleto, cinza=não registrado, vermelho=falta, cinza-2=fim de semana), dia atual com outline na cor primária, total no mês + faltas. Animação de slide horizontal entre meses.
- [ ] **PONTO-05**: Bottom sheet de registro de ponto com Avatar+nome no topo, time pickers de Entrada/Saída/Almoço, total calculado ao vivo em card destacado, toggle "Marcar como falta" com select de motivo, observação opcional, validações inline (saída > entrada, volta > saída do almoço, falta exige motivo).
- [ ] **PONTO-06**: Perfil do funcionário ganha abas "Vales" / "Ponto" (underline tab). Aba Ponto mostra mini-stats (horas, faltas, atrasos, entrada média) + mini-calendário do mês.
- [ ] **PONTO-07**: Dashboard ganha 2 cards novos abaixo dos cards de vales: "Pontos pendentes hoje" e "Faltas no mês" com variação % vs mês anterior. Mesma estética dos cards existentes.
- [ ] **PONTO-08**: Mocks de ponto cobrem últimos 30 dias úteis para todos os 10 funcionários, com distribuição realista (70% completo, 15% parcial, 10% sem registro, 5% falta justificada). Geração determinística por (employeeId, date) — não regenera a cada reload.
- [ ] **PONTO-09**: Persistência de ponto em `localStorage` (chave `vale.ponto`) — registros novos sobrevivem a reload, botão de reset zera tudo.

### Theming Strict Dark (Phase 3)

- [ ] **THEME-DARK-01**: Tema dark é o default absoluto. `prefers-color-scheme: light` é ignorado. Light só via `[data-theme="light"]` no `<html>` (opt-in via futuro toggle).
- [ ] **THEME-DARK-02**: `<meta name="color-scheme" content="dark">` (sem mais `light`). Mobile browsers não tentam aplicar Auto Dark Theme — bug raiz da Phase 1 resolvido em definitivo.

### Out of Scope

- **Toggle manual claro/escuro** — produto vai decidir em marco futuro; hoje a fonte é só o `prefers-color-scheme`.
- **iOS Safari mobile** — não temos dispositivo de teste; se passar de graça nos fixes, ótimo, mas não bloqueia.
- **Refatoração para Tailwind/CSS-in-JS** — manter CSS puro como está.
- **Auditoria de acessibilidade WCAG completa** — fica para marco de qualidade dedicado.

## Traceability

| REQ-ID    | Phase | Status |
|-----------|-------|--------|
| THEME-01  | Phase 1 | Active |
| THEME-02  | Phase 1 | Active |
| THEME-03  | Phase 1 | Active |
| THEME-04  | Phase 2 | Active |
| THEME-05  | Phase 1 | Active |
| DEMO-01   | Phase 1.1 | Active |
| DEMO-02   | Phase 1.1 | Active |
| PONTO-01..09 | Phase 3 | Active |
| THEME-DARK-01 | Phase 3 | Active |
| THEME-DARK-02 | Phase 3 | Active |

---
*Last updated: 2026-05-04*
