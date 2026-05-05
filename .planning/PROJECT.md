# Vale — Controle de Adiantamentos + Folha de Ponto

## What This Is

Aplicação web mobile-first para gestão de RH em pequenas e médias empresas. Centraliza duas operações que hoje vivem em planilhas separadas:

1. **Vales (adiantamentos salariais)** — funcionários pedem, a gestora aprova/nega/marca como pago.
2. **Folha de ponto** — a gestora registra entrada, almoço, saída e faltas dos funcionários (modelo gestor-registra, não funcionário-bate-ponto).

Persona principal: "Marina", coordenadora de RH. Stack: React 18 + Vite + CSS puro (sem framework UI), tema dark como padrão, deploy estático na Vercel.

## Core Value

A gestora resolve **vale e folha de ponto do celular em segundos**, sem abrir planilha. App parece aplicativo nativo (bottom nav animada com bolha, FAB speed-dial, bottom sheets, calendário visual mensal), não site responsivo.

## Context

- **Estado atual**: MVP funcional. Tela inicial (Hoje), Pedidos, Equipe, Eu — navegação por bubble-nav inferior animada. Tema dark via `prefers-color-scheme`.
- **Problema crítico identificado**: no celular real (Chrome Android / Samsung Internet com modo dark do sistema ligado) o tema fica "feio e bugado" — cores washed-out, gradiente teal vira cinza-esverdeado, cards translúcidos. Causa: navegador aplicando "Auto dark theme for web contents" sobre o CSS dark já existente, dobrando a transformação. No DevTools mobile do desktop não acontece.
- **Sem backend**: dados vêm de `src/data.js` (mock estático). API real é trabalho futuro.
- **Sem autenticação**: tela inicial assume "Olá, Marina" hardcoded.
- **Diagnóstico inicial e fix parcial já aplicado** nesta sessão: meta `color-scheme` invertida, `color-scheme: dark` adicionado no media query dark, hardcodes de `rgba(255,255,255,…)` substituídos por `var(--surface)`. Falta validar no celular real e cobrir os hardcodes restantes em `screens.jsx` (gradiente teal hero, `rgba(255,255,255,0.85)` nas barras de gráfico) e `forms.jsx`.

## Requirements

### Validated

- ✓ Dashboard com total do mês, pendentes/aprovados, top funcionários — existente em `src/screens.jsx`
- ✓ Listagem de pedidos com filtros — existente
- ✓ Cadastro de funcionário e novo pedido — existentes em `src/forms.jsx`
- ✓ Tema claro funcional — existente
- ✓ Tema escuro funcional **no DevTools** — existente, mas com bug em celular real

### Active

- [ ] **THEME-01**: tema escuro renderiza fiel em Chrome/Samsung Internet/Firefox Android com auto-dark do sistema ligado, sem dupla transformação
- [ ] **THEME-02**: nenhum hardcode `#fff`/`rgba(255,…)`/hex claro permanece em componentes — tudo via tokens CSS
- [ ] **THEME-03**: gradiente teal do hero, barras de gráfico semanal e estados de toast permanecem visualmente vibrantes em dark real
- [ ] **THEME-04**: smoke test visual em pelo menos 2 navegadores mobile reais antes de marcar como resolvido
- [ ] **PONTO-01..06**: folha de ponto completa — lista geral, calendário do funcionário, bottom sheet de registro, abas no perfil, cards no dashboard, mocks consistentes (ver REQUIREMENTS.md)

### Out of Scope (este marco)

- Toggle manual claro/escuro — atual depende só de `prefers-color-scheme`. Decidir em marco futuro.
- Backend / banco / autenticação — **decisão explícita do usuário (2026-05-05)**: enquanto for MVP demonstrativo, o app fica 100% client-side com dados mockados de `data.js` como seed e persistência em `localStorage` por dispositivo. Backend/auth voltam ao escopo só após a aprovação do MVP pelo stakeholder.
- Refatoração de componentes — só ajustes de tokens.
- iOS / Safari Mobile — sem dispositivo de teste; testar se for trivial mas não bloquear o marco.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Manter `prefers-color-scheme` como única fonte do tema | Toggle manual é escopo de produto, não de bug fix. Foco aqui é o que já existe funcionar | — Pending |
| Não migrar para Tailwind/shadcn neste marco | Bug é de tokens CSS, não de arquitetura de styling. Refator é distração | — Pending |
| Usar `color-scheme: dark` explícito como sinal canônico para o navegador | Documentação MDN e relatos de campo (Samsung Internet, Chrome 96+) confirmam que essa é a forma de desativar o auto-darkening | — Pending |
| MVP fica client-side, persistência em `localStorage` (sem backend, sem auth) | Banco ainda não decidido. Para demonstração, dados mockados + persistência local são suficientes para o stakeholder interagir e validar a UX. Backend volta ao escopo após aprovação | — Implemented (Phase 1.1) |
| Folha de ponto registrada pela gestora (modelo gestor-bate-ponto), não pelo funcionário | Mantém o app como ferramenta única de RH. Reaproveita o cadastro de funcionários existente. Coerente com o fluxo de Vales (gestora aprova) | — Implemented (Phase 3) |
| Tema dark é o default absoluto do app — `prefers-color-scheme: light` é ignorado, light só via `[data-theme="light"]` futuro toggle | Para a demo o stakeholder vê sempre a marca (teal vibrante sobre slate-blue). Resolve definitivamente o auto-darkening do mobile (não há mais "tema light" pro browser tentar darkenizar) | — Implemented (Phase 3) |
| Bottom nav mantém o BubbleNav animado existente — não troca pelo mock do handoff zip | UX já refinada (notch, cross-fade de ícone, transição da bolha). Substituir por nav padrão regrediria a sensação "nativa". Apenas troca os ITENS: "Eu" sai (vai pra avatar do topbar), "Ponto" entra | — Implemented (Phase 3) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

**After each milestone** (via `/concluir-marco`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-04 after initialization*
