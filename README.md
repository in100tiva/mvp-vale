# Vale — adiantamento salarial sem planilha

[![License: MIT](https://img.shields.io/badge/license-MIT-3DA639?style=flat-square)](LICENSE)
![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Mobile-first](https://img.shields.io/badge/mobile--first-sim-0A66C2?style=flat-square)

MVP web mobile-first para RH e colaboradores gerenciarem **adiantamentos salariais** e **registro de ponto** em um só lugar: solicitação, aprovação, limite disponível e histórico — sem depender de planilha ou troca de mensagens.

> Projeto de portfólio: front-end completo, persistência local e fluxo de aprovação. A camada de API é o próximo passo natural (ver [Roadmap](#roadmap)).

## O problema

Em operações pequenas, adiantamento salarial costuma viver em planilha + WhatsApp: o colaborador pede, o RH confere o limite, alguém aprova e o histórico se perde. O Vale modela esse fluxo como produto:

- **Colaborador** vê quanto já adiantou, quanto ainda pode pedir e o status de cada solicitação.
- **RH** vê a fila de pedidos, aprova ou recusa e acompanha o impacto no limite.
- **Ponto** fica no mesmo app, evitando dois sistemas para a mesma rotina.

## Funcionalidades

- **Dashboard** com saldo, limite e últimos pedidos
- **Pedidos de adiantamento**: criação, detalhe e mudança de status
- **Aprovação pelo RH** com histórico por colaborador
- **Registro de ponto** e espelho de horas
- **Equipe**: cadastro e perfil de cada colaborador
- **Navegação mobile** (bottom nav) e **sidebar no desktop**
- Persistência em `localStorage` com opção de reset — ideal para demonstrar o fluxo sem backend

## Stack

| Camada | Escolha |
|---|---|
| UI | React 19 + JSX |
| Build/dev | Vite 8 |
| Estilo | CSS próprio, mobile-first |
| Estado | `useState` + hooks de persistência (`useLocalStorage`) |
| Dados | Mock estruturado em `src/data.js` |

Sem biblioteca de estado, router ou UI kit: o objetivo era manter o MVP leve e legível.

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de produção
npm run preview  # serve o build
```

Requisitos: Node.js 18+.

## Estrutura

```text
src/
├── App.jsx            # shell, navegação e composição das telas
├── screens.jsx        # dashboard, pedidos, equipe, perfil
├── forms.jsx          # novo pedido, novo funcionário, detalhe/aprovação
├── ponto.jsx          # registro e espelho de ponto
├── ui.jsx             # componentes base (avatar, sheet, toast)
├── icons.jsx          # ícones em SVG
├── data.js            # dados iniciais e helpers (moeda, datas)
├── useLocalStorage.js # persistência e reset
└── styles.css         # design mobile-first
```

## Decisões de projeto

- **Persistência local em vez de backend** para validar o fluxo com usuários antes de investir em API.
- **Dados isolados em `data.js`** para trocar mock por chamadas HTTP sem reescrever as telas.
- **Componentes de formulário separados das telas** para o fluxo de aprovação não virar um componente gigante.

## Roadmap

- [ ] API REST + PostgreSQL (pedidos, limites, ponto)
- [ ] Autenticação e papéis (colaborador / RH)
- [ ] Testes de fluxo (Vitest + Testing Library)
- [ ] Exportação de espelho de ponto (PDF/CSV)

## Licença

[MIT](LICENSE) © Luan Oliveira dos Santos
