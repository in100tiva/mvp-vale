# Requirements — Vale

Marco atual: **v0.1 — Correção de tema escuro em mobile real**

## v1 Requirements

### Theme Robustness

- [ ] **THEME-01**: Em Chrome Android, Samsung Internet e Firefox Android com modo escuro do sistema ativado, o app renderiza com as MESMAS cores que aparecem no DevTools mobile do desktop (sem auto-darkening do navegador aplicando segunda transformação).
- [ ] **THEME-02**: Nenhum componente em `src/screens.jsx`, `src/forms.jsx`, `src/ui.jsx`, `src/BubbleNav.jsx` ou `src/styles.css` contém valores de cor hardcoded para light theme (`#fff`, `#FFFFFF`, `rgba(255,255,255,…)`, slates `#CBD5E1`/`#F1F5F9` etc.) que não derivem de tokens via `var(--…)` ou que não sejam neutros propositais (ex: branco sobre primary).
- [ ] **THEME-03**: O gradiente teal do hero "TOTAL PEDIDO EM MAIO" continua vibrante em dark real — usa o token `--primary` em vez de hex literal `#0F766E`/`#0D6963`, ou tem versão dark explícita.
- [ ] **THEME-04**: Smoke test visual passa em pelo menos 2 dispositivos/navegadores mobile reais — comparado lado a lado com DevTools mobile, sem diferença perceptível.
- [ ] **THEME-05**: `<meta name="color-scheme">` e `<meta name="theme-color">` declaram corretamente o suporte a dark, e a barra de status do navegador combina com o `--bg` do app.

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

---
*Last updated: 2026-05-04*
