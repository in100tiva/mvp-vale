# Política de segurança

## Escopo

O Vale é uma aplicação **client-side**: não há backend, banco de dados remoto nem coleta de dados pessoais. Os dados de demonstração ficam apenas no `localStorage` do navegador de quem usa o app. Isso reduz bastante a superfície de ataque, mas não elimina riscos — XSS via dependências, por exemplo, continua relevante.

## Como relatar uma vulnerabilidade

**Não abra issue pública.** Use o canal privado do GitHub:

👉 [Abrir um security advisory privado](https://github.com/in100tiva/mvp-vale/security/advisories/new)

Inclua, se possível:

- descrição da falha e impacto potencial;
- passos para reproduzir (ou prova de conceito);
- navegador, sistema e versão do commit testado;
- sugestão de correção, se houver.

## O que esperar

| Etapa | Prazo esperado |
|---|---|
| Confirmação de recebimento | até 3 dias úteis |
| Avaliação inicial e classificação | até 7 dias úteis |
| Correção ou plano divulgado | conforme severidade |

Você será creditado no advisory e nas notas da release, a menos que prefira permanecer anônimo.

## Práticas adotadas no repositório

- **Secret scanning + push protection** habilitados: segredos não entram no histórico.
- **Dependabot** semanal para dependências npm e GitHub Actions.
- **CI obrigatória** (lint + build) em todo pull request para `main`.
- **`permissions: contents: read`** como padrão nos workflows, com permissões extras declaradas apenas onde necessário.
- Releases com notas versionadas em [CHANGELOG.md](CHANGELOG.md).

## Versões suportadas

Projeto em estágio inicial: apenas a versão mais recente publicada em [releases](https://github.com/in100tiva/mvp-vale/releases) recebe correções de segurança.
