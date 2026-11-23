# Como contribuir com o Vale

Obrigado pelo interesse! Este projeto é um MVP de portfólio, mas recebe correções, melhorias de UX e sugestões com prazer.

## Antes de abrir uma issue

- Procure nas [issues abertas](https://github.com/in100tiva/mvp-vale/issues) por algo parecido.
- Para **falhas de segurança**, não abra issue: use o canal privado descrito no [SECURITY.md](SECURITY.md).
- Ideias de produto: veja se já estão no [Roadmap](README.md#roadmap).

## Fluxo de contribuição

1. Abra uma issue descrevendo o problema ou a proposta.
2. Faça um fork e crie uma branch a partir de `main` com nome descritivo:
   - `fix/limite-apos-aprovacao`
   - `feat/filtro-por-setor`
   - `docs/readme-demo`
3. Escreva commits pequenos e com mensagem no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/): `fix:`, `feat:`, `docs:`, `chore:`, `ci:`, `refactor:`.
4. Abra o pull request preenchendo o template. PRs sem contexto demoram mais para ser revisados.

## Padrões de código

- **JavaScript + JSX**, sem TypeScript por enquanto.
- **Sem UI kit**: estilos em CSS próprio, mobile-first.
- Componentes funcionais e hooks; nada de classes.
- Textos de interface e comentários em **português**.
- O lint é a fonte da verdade de estilo:

```bash
npm ci
npm run lint
npm run build
```

Os três comandos precisam passar antes do PR ser aceito — é exatamente o que a CI executa.

## Commits e merges

- Merges por **squash**: um PR = um commit em `main`.
- A branch do PR é apagada automaticamente após o merge.
- Títulos de PR e commits seguem Conventional Commits, porque alimentam o [CHANGELOG](CHANGELOG.md).

## Licença das contribuições

Ao enviar um PR você concorda que sua contribuição é licenciada sob a [MIT](LICENSE), os mesmos termos do projeto.
