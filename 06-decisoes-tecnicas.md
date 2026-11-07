# Decisões técnicas

Registre aqui decisões que afetam implementação. Quando uma decisão mudar, atualize os documentos dependentes e marque a anterior como substituída.

## ADR-001 — Construção do zero

- **Estado:** Confirmada.
- **Decisão:** construir web, mobile e API do zero; o FlowDesk não é base para o produto.
- **Motivo:** escopo declarado pelo autor.
- **Consequências:** especificações não devem depender de código do FlowDesk.

## ADR-002 — Linguagem e workspace

- **Estado:** Confirmada como direção de stack.
- **Decisão:** TypeScript para web, mobile, API e worker; monorepo com pnpm workspaces.
- **Motivo:** reaproveitar a experiência React/TypeScript e facilitar contrato compartilhado entre aplicações.
- **Consequências:** manter pacotes compartilhados pequenos; não compartilhar UI web/mobile; iniciar sem Turborepo.

## ADR-003 — Cliente web

- **Estado:** Confirmada como direção de stack.
- **Decisão:** Next.js App Router, React, TypeScript e Tailwind CSS.
- **Motivo:** aprofundar a stack web já conhecida usando o modelo atual do Next.js.
- **Referência:** https://nextjs.org/docs/app

## ADR-004 — Cliente mobile e navegação

- **Estado:** Confirmada como direção de stack.
- **Decisão:** React Native, Expo, TypeScript e Expo Router.
- **Motivo:** reaproveitar React Native/Expo e adotar navegação por arquivos, deep links e rotas tipadas.
- **Referência:** https://docs.expo.dev/router/introduction/

## ADR-005 — API e arquitetura

- **Estado:** Confirmada como direção de stack.
- **Decisão:** Node.js, TypeScript, Express e REST/OpenAPI em monólito modular.
- **Motivo:** aproveitar experiência prática com Express e construir uma API própria para ambos os clientes.
- **Consequências:** separar por domínios; usar casos de uso quando houver regra relevante; sem microserviços no MVP.

## ADR-006 — Persistência

- **Estado:** Confirmada como direção de stack.
- **Decisão:** PostgreSQL com Prisma; migrations versionadas; pgvector proposto para uma fase de busca semântica.
- **Motivo:** manter uma base relacional para o domínio e, se validado, embeddings no mesmo banco.
- **Referências:** https://www.prisma.io/docs e https://github.com/pgvector/pgvector

## ADR-007 — Estado nas interfaces

- **Estado:** Confirmada como direção de stack.
- **Decisão:** TanStack Query para estado remoto; Zustand somente para estado global de interface necessário; estado local para o restante; React Hook Form + Zod para formulários.
- **Motivo:** separar cache/sincronização da API de estado de UI e evitar múltiplas bibliotecas com funções sobrepostas.
- **Referências:** https://tanstack.com/query/latest/docs/framework/react/installation e https://zustand.docs.pmnd.rs/learn/getting-started/introduction

## ADR-008 — Fila e processamento assíncrono

- **Estado:** Confirmada.
- **Decisão:** Redis + BullMQ, com worker Node/TypeScript em processo separado da API.
- **Motivo:** IA e tarefas demoradas não devem bloquear requisições; fila permite observar estado, limitar retentativas e reprocessar falhas.
- **Consequências:** Redis não será fonte de verdade transacional; jobs terão idempotência e retentativas controladas.
- **Referência:** https://docs.bullmq.io/quick-start

## ADR-009 — IA aplicada

- **Estado:** Confirmada como direção de produto; provedor/modelo pendentes.
- **Decisão:** iniciar com resumo e classificação sugerida de solicitações. IA não atribui responsáveis nem altera prioridade/status automaticamente. Resultados passam por revisão humana.
- **Motivo:** aplicar IA a uma necessidade do fluxo, mantendo controle e rastreabilidade.
- **Consequências:** camada de provedor pequena, saída validada, registro de versão/estado/feedback e tratamento de indisponibilidade.

## ADR-010 — Engenharia de dados

- **Estado:** Confirmada como direção aplicada; métricas pendentes de definição.
- **Decisão:** registrar eventos do domínio, derivar métricas operacionais e manter conjunto de exemplos para avaliar sugestões. Usar PostgreSQL e, se busca semântica for aprovada, pgvector.
- **Fora do escopo:** treinamento de modelos, data lake, Kafka, Spark ou plataforma analítica separada no MVP.

## ADR-011 — Ambiente local e containers

- **Estado:** Confirmada.
- **Decisão:** Docker e Docker Compose para ambiente reproduzível, incluindo PostgreSQL e Redis e, quando conveniente, API/worker.
- **Motivo:** simplificar instalação e integração local dos serviços.
- **Referência:** https://docs.docker.com/compose/

## ADR-012 — Testes e CI

- **Estado:** Confirmada como direção de stack.
- **Decisão:** Vitest para API/worker/web, Jest Expo com React Native Testing Library para mobile, Playwright para fluxos web críticos e GitHub Actions para lint, tipos, testes e builds.
- **Consequências:** manter número de runners controlado; definir cobertura com base no risco, sem perseguir percentual arbitrário.

## Decisões de produto pendentes

- Público, papéis e autorização.
- Autenticação e gestão de sessão.
- Campos, status, prioridades e transições de solicitação.
- Provedor/modelo de IA, política de envio/retensão de dados e orçamento.
- Métricas, limites de qualidade e conjunto de avaliação.
- Se pgvector e busca semântica entram no MVP ou na fase seguinte.
- Nome final para publicação externa.

## Modelo para novas decisões

```text
## ADR-NNN — Título
- Estado: Proposta | Confirmada | Substituída
- Contexto:
- Decisão:
- Alternativas consideradas:
- Consequências:
- Data:
```
