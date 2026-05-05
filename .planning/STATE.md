# Estado do Projeto

## Referência do Projeto

Ver: .planning/PROJECT.md (atualizado em 2026-05-05)

**Valor central:** Resolver vale e folha de ponto do celular em segundos, sem abrir planilha.
**Foco atual:** v0.1 → Phase 2 (Validação em mobile real) — bloqueada por hardware do usuário. Phase 3 (Folha de Ponto + Dark estrito) entregue.

## Posição Atual

Fase: 2 de 3 (Validação em mobile real) — Phase 3 já entregue, mas Phase 2 segue como gate de fechamento do marco.
Plano: 0 de 0 na fase atual
Status: Bloqueada — depende de teste em celular real do usuário
Última atividade: 2026-05-05 — Phase 3 entregue: folha de ponto completa (lista geral, detalhe com calendário 7-col, bottom sheet de registro com validações, abas Vales/Ponto no perfil, 2 cards novos no dashboard, FAB speed-dial), dark estrito como tema absoluto, mocks determinísticos para 30 dias × 10 funcionários, persistência em localStorage. Build passa em 311ms sem warnings novos.

Progresso: [█████████░] ~85% (Phases 1, 1.1 e 3 entregues; falta validação visual em mobile real)

## Métricas de Performance

**Velocidade:**
- Total de planos concluídos: 3 (Phase 1, Phase 1.1, Phase 3 — todos inline)
- Tempo total de execução: ~2 horas

**Por Fase:**

| Fase | Planos | Total | Média/Plano |
|------|--------|-------|-------------|
| 1 — Token-fy | 1 | 25min | 25min |
| 1.1 — localStorage demo | 1 | 15min | 15min |
| 3 — Folha de Ponto + Dark | 1 | ~75min | ~75min |
| 2 — Validação mobile real | 0 | — | — |

**Tendência Recente:** Phase 3 foi escopo grande (5 arquivos novos/mudados, ~900 linhas), entregue em 1 plano inline a partir do handoff de Claude Design — adaptando JSX globalizado do bundle para imports ESM e mantendo o BubbleNav atual em vez de adotar a nav do zip.

## Contexto Acumulado

### Decisões

Decisões estão registradas na tabela de Decisões Chave do PROJECT.md.
Decisões recentes que afetam o trabalho atual:

- 2026-05-05: Tema dark é o default absoluto. `prefers-color-scheme: light` é ignorado. Light só via `[data-theme="light"]` (futuro toggle). Mata o auto-darkening do mobile em definitivo.
- 2026-05-05: Folha de ponto é gestor-registra (mesmo perfil que aprova vale). App continua sendo ferramenta única de RH.
- 2026-05-05: BubbleNav atual mantido — só itens trocados ("Eu" sai do bottom nav, vai para avatar do topbar; "Ponto" entra). Sidebar desktop ganha "Ponto" e mantém "Eu".
- 2026-05-05: MVP fica client-side (decisão de 2026-05-05 anterior reforçada). Ponto também persiste em `localStorage`, chave `vale.ponto`.

### Todos Pendentes

- **Validar em celular real (Phase 2)**: agora que dark é forçado, o teste é só confirmar que o app aparece bonito no Chrome Android e Samsung Internet — sem mais surpresa de auto-dark.
- **Push para main**: bloqueado por credenciais Git da máquina (autenticada como `luanpdd`, repo é de `in100tiva`). 9 commits prontos pra subir.

### Bloqueios/Preocupações

- **Phase 2 depende de hardware** — sem dispositivo de teste físico aqui.
- **Push pendente** — credenciais Git da máquina não batem com o owner do repo.

## Continuidade de Sessão

Última sessão: 2026-05-05
Parou em: Phase 3 commitada localmente. App agora oferece vale + folha de ponto em uma única ferramenta, tema dark absoluto, FAB speed-dial, calendário visual mensal por funcionário, bottom sheet de registro com validações. Build production passa. Aguarda push para main e validação visual em celular real.
Arquivo de retomada: Nenhum
