# Changelog

Todas as mudanças relevantes deste projeto estão documentadas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não publicado]

## [1.0.0] - 2026-11-23

### Adicionado

- **CodeQL** (`.github/workflows/codeql.yml`): análise estática de segurança em push, pull request e semanal.
- **Dependency review** (`.github/workflows/dependency-review.yml`): bloqueia pull request que introduza dependência com severidade alta.
- **OpenSSF Scorecard** (`.github/workflows/scorecard.yml`): mede a postura de segurança e publica o SARIF no code scanning.
- `CITATION.cff` para citação do projeto.
- Badge de CodeQL no README e seção "Qualidade e automação" atualizada.
- Seção **Demo** no README, separando o demo público (GitHub Pages) do preview privado na Vercel, além dos badges de linguagem, release e Vercel.
- **GitHub Discussions** habilitadas para dúvidas, ideias e relatos de uso.

### Alterado

- Ações do GitHub fixadas por SHA (commit imutável) em todos os workflows, reduzindo o risco de supply chain.
- Versão elevada para `1.0.0` em `package.json`, `package-lock.json`, `CITATION.cff` e neste changelog, alinhada à release publicada.
- Template de pull request padronizado como `.github/PULL_REQUEST_TEMPLATE.md`.
- Código de Conduta passa a indicar também o canal privado de security advisories para falhas de segurança.
- README atualizado com os badges de CI, release e linguagem, comandos reais do `package.json` e estrutura de pastas.

## [0.1.0] - 2026-11-23

### Adicionado

- Pipeline de **CI** com `npm ci`, ESLint e build em cada push e pull request para `main`.
- **Deploy contínuo do demo** no GitHub Pages, com caminho base configurável por `VITE_BASE_PATH`.
- **Dependabot** semanal para dependências npm e GitHub Actions.
- Documentação comunitária: `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `CODE_OF_CONDUCT.md`, templates de issue/PR e `CODEOWNERS`.
- Workflow para o GitHub gerar notas de release categorizadas (`.github/release.yml`).
- Metadados do `package.json`: licença, repositório, homepage, `engines` de Node e versão `0.1.0`.
- Scripts de qualidade documentados no README e `.nvmrc`/`.gitattributes` para padronizar ambiente e finais de linha.

### Alterado

- **Lint zerado**: 87 problemas (85 erros, 2 avisos) corrigidos.
  - `.claude/` (framework de IA vendorizado) passou a ser ignorado pelo ESLint; o código em `src/` não tinha erros de `no-undef`.
  - Imports não utilizados removidos em `src/forms.jsx`.
  - Contexto e hook de toast movidos para `src/toast.js`, evitando export misto em `ui.jsx` (`react-refresh/only-export-components`).
  - Sincronização de estado por efeito substituída por manipulação direta de evento em `src/forms.jsx`.
  - Dependência instável hoisted para o escopo de módulo em `src/screens.jsx`.

### Corrigido

- Loop de estado desnecessário ao trocar o setor no formulário de novo funcionário.
- Aviso de dependências do `useMemo` no filtro de período de `src/screens.jsx`.

[1.0.0]: https://github.com/in100tiva/mvp-vale/releases/tag/v1.0.0
[0.1.0]: https://github.com/in100tiva/mvp-vale/releases/tag/v0.1.0
