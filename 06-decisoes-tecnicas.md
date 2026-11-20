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

- **Estado:** Escopo funcional confirmado; provedor local selecionado; modelo pendente.
- **Decisão:** oferecer revisão opcional de rascunho antes do envio, sugerindo perguntas de esclarecimento e melhorias não vinculantes; após criação, oferecer resumo e recomendações de categoria, prioridade e equipe para revisão do Operador. Na Web, a revisão é iniciada por **Revisar com IA**, apresenta carregamento e mostra resultados em painel separado no formulário. Propostas textuais só alteram o campo correspondente por ação explícita; não há aplicação automática nem ação de aceitar tudo. O Solicitante pode ignorar o painel e enviar. Falha da IA preserva o rascunho e não bloqueia a criação. Ollama em container Docker é o provedor local preferido. A camada de integração deve permitir substituir o provedor sem alterar o contrato do formulário ou da API.
- **Dados:** usar título e descrição, com remoção de contatos/credenciais reconhecíveis; não enviar informações financeiras, de saúde ou anexos. A revisão prévia não persiste o rascunho. Provedores hospedados exigem avaliação de custo, cotas e política de dados.
- **Controle:** toda saída é validada e revisada por pessoa; nada é aplicado automaticamente. Falha de IA não bloqueia a operação básica.
- **Motivo:** aplicar IA a uma necessidade do fluxo, mantendo controle e rastreabilidade.
- **Consequências:** camada de provedor pequena, saída validada, registro de versão/estado/feedback e tratamento de indisponibilidade.

## ADR-010 — Engenharia de dados

- **Estado:** Confirmada como direção aplicada; métricas pendentes de definição.
- **Decisão:** registrar eventos do domínio, derivar métricas operacionais e manter conjunto de exemplos para avaliar sugestões. Usar PostgreSQL e, se busca semântica for aprovada, pgvector.
- **Fora do escopo:** treinamento de modelos, data lake, Kafka, Spark ou plataforma analítica separada no MVP.

## ADR-011 — Ambiente local e containers

- **Estado:** Confirmada; composição completa ainda não implementada.
- **Decisão:** usar Docker Compose para executar Web, API, PostgreSQL, Redis, Keycloak e Ollama no ambiente local. O Worker será incluído quando implementado; Mobile pode continuar fora dos containers para facilitar emuladores.
- **Rede:** navegador acessa a API por endereço publicado no host ou proxy Web; serviços containerizados usam DNS interno do Compose entre si. Ollama não deve ficar exposto publicamente sem autenticação.
- **Persistência e recursos:** manter modelos Ollama em volume; selecionar modelo considerando licença, RAM/CPU/GPU, armazenamento e tempo de resposta.
- **Motivo:** simplificar instalação e integração local dos serviços.
- **Referências:** https://docs.docker.com/compose/ e https://docs.ollama.com/docker

## ADR-012 — Testes e CI

- **Estado:** Confirmada como direção de stack.
- **Decisão:** Vitest para API/worker/web, Jest Expo com React Native Testing Library para mobile, Playwright para fluxos web críticos e GitHub Actions para lint, tipos, testes e builds.
- **Consequências:** manter número de runners controlado; definir cobertura com base no risco, sem perseguir percentual arbitrário.

## ADR-013 — Identidade e papéis

- **Estado:** Confirmada; detalhes de integração pendentes.
- **Decisão:** usar Keycloak para SSO e gerenciamento de usuários. Um grupo do Keycloak identifica Operadores; demais usuários autenticados são Solicitantes. Web, mobile e API dependem da identidade autenticada pelo Keycloak; links de acesso por e-mail ficam fora do MVP.
- **Autorização inicial:** ambos os papéis consultam todas as solicitações da empresa. Solicitantes criam solicitações e comentam nas próprias; Operadores comentam, atribuem e atualizam todas as solicitações da empresa.
- **Consequências:** a API continua responsável por aplicar autorização. Protocolo, claims, nome do grupo, configuração do provedor corporativo e limites técnicos da empresa devem ser definidos antes da implementação.
- **Referência:** https://www.keycloak.org/docs/latest/server_admin/

## ADR-014 — Observabilidade técnica

- **Estado:** Proposta; implementação e ferramentas ainda não aprovadas.
- **Contexto:** API, banco, Redis e o futuro worker precisam ter disponibilidade, falhas e desempenho observáveis; as métricas de produto e os eventos de domínio não cobrem saúde técnica.
- **Decisão proposta:** instrumentar serviços com OpenTelemetry; iniciar com logs estruturados e correlacionados, liveness/readiness e métricas RED da API. Avaliar Prometheus e Grafana para visualização local via Docker Compose. Adicionar traces e métricas de fila/worker conforme o worker for implementado.
- **Segurança:** não registrar tokens, segredos, conteúdo completo de solicitações nem dados pessoais desnecessários; evitar IDs únicos como labels de métricas.
- **Fora desta etapa:** monitoramento de frontend em produção, alertas, backend/retention de traces e logs, SLIs/SLOs e objetivos numéricos. Defini-los após implantação e coleta de uma linha de base.
- **Consequência:** `RequestEvent` e métricas de negócio permanecem separados da telemetria operacional.

## Decisões de produto pendentes

- Delimitação entre operação interna e atendimento a clientes.
- Limite técnico da empresa, edição de solicitações por Solicitantes e exclusão.
- Protocolo SSO, claims de token, nome do grupo de Operadores e configuração do provedor corporativo no Keycloak.
- Modelo Ollama, requisitos de recursos/licença e tratamento de solicitações com conteúdo proibido.
- Política para um eventual provedor hospedado, incluindo cotas, custo e tratamento de dados.
- Métricas, limites de qualidade e conjunto de avaliação.
- Stack de observabilidade, retenção de telemetria, objetivos de serviço e política de alertas.
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
