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
| 2 | Validação em mobile real | Confirmar que o fix elimina a discrepância entre DevTools e celular real em ≥ 2 navegadores | THEME-04 | 3 |

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

## Próximos marcos (backlog estratégico)

- v0.2 — Toggle manual claro/escuro (persistente em localStorage)
- v0.3 — Backend real (Supabase já listado como MCP) + autenticação
- v0.4 — Notificações push para gestora quando novo pedido entra

---
*Last updated: 2026-05-04 after initialization*
