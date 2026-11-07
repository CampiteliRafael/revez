# Escopo de todos os projetos do sistema Revez

**Status:** direção técnica aprovada; detalhes funcionais em validação  
**Versão:** 0.2  
**Data:** 6 de novembro de 2026

## 1. Objetivo

O Revez organiza solicitações de trabalho entre pessoas e equipes. O produto deve registrar pedidos, tornar visíveis responsáveis e próximos passos, preservar histórico e oferecer apoio de IA para reduzir o trabalho repetitivo de triagem. Web e mobile serão criados do zero e usarão a mesma API.

## 2. Projetos e componentes

### A — Revez Web

**Stack:** Next.js App Router, React, TypeScript e Tailwind CSS.

Interface para operar o ciclo completo da solicitação: criar e consultar a fila, abrir detalhes, comentar e atualizar até a conclusão. Também exibe sugestões de IA para revisão humana e indicadores acordados.

### B — Revez Mobile

**Stack:** React Native, Expo, Expo Router e TypeScript.

Aplicativo para executar o ciclo completo da solicitação: consultar fila, pesquisar, criar, acompanhar detalhes e histórico, comentar e atualizar até a conclusão. Deve tratar carregamento, falha e conectividade limitada. Modo offline completo, push e anexos ficam fora do primeiro escopo.

### C — Revez API

**Stack:** Node.js, TypeScript, Express, REST, OpenAPI, Zod, Prisma e PostgreSQL.

Fonte das regras de negócio e dos dados. Responsável por autenticação/autorização, validação, solicitações, comentários, eventos de histórico, filtros, agregações e enfileiramento de trabalhos de IA. A API será um monólito modular organizado por domínio/funcionalidade, sem microserviços no MVP.

### D — Revez Worker

**Stack:** Node.js, TypeScript, BullMQ e Redis.

Processa tarefas demoradas fora do ciclo da requisição HTTP: sugestões de resumo e categoria de solicitações e, em fases posteriores, recomendações e geração/atualização de embeddings quando a busca semântica entrar no escopo. Deve suportar tentativas controladas, estados de processamento, falhas observáveis e proteção contra resultados duplicados. A IA não altera automaticamente campos da solicitação.

### E — Dados e recursos de IA

- PostgreSQL é a fonte de verdade dos dados transacionais.
- `RequestEvent` registra mudanças relevantes do fluxo para auditoria e métricas.
- Indicadores derivados respondem perguntas de operação, como volume por categoria e tempo de atendimento, após definição das regras de cálculo.
- pgvector é proposto para armazenar embeddings no PostgreSQL e buscar solicitações semelhantes, evitando um banco vetorial separado no início.
- Resultados de IA devem guardar referência ao pedido, tipo de sugestão, versão/configuração usada, resultado, estado de revisão e feedback humano, evitando armazenar conteúdo desnecessário.
- Um conjunto pequeno de exemplos fictícios ou anonimizados permitirá avaliar classificação e resumo antes de mudanças de prompt/modelo.

Isso constitui engenharia de IA aplicada e engenharia de dados em escopo de produto. Não inclui treinamento de modelos, data lake, Kafka, Spark ou plataforma analítica independente.

### F — Repositório e ambiente local

**Proposta:** monorepo TypeScript com pnpm workspaces: `apps/web`, `apps/mobile`, `apps/api`, `apps/worker` e pacotes compartilhados pequenos para contrato/schemas quando fizer sentido. Não compartilhar componentes visuais entre web e mobile.

Docker e Docker Compose devem oferecer um ambiente reproduzível para API, worker, PostgreSQL e Redis. Web e mobile também podem rodar localmente fora de containers durante o desenvolvimento. Não adicionar Turborepo até haver uma necessidade observável de cache/orquestração.

## 3. Stack e responsabilidades

| Necessidade | Ferramenta proposta | Responsabilidade |
|---|---|---|
| Cliente web | Next.js, React, TypeScript, Tailwind CSS | Interface web e navegação |
| Cliente mobile | React Native, Expo, Expo Router | Interface Android/iOS |
| Dados remotos | TanStack Query | Busca, cache, sincronização e mutações da API |
| Estado global de interface | Zustand, apenas quando necessário | Estado de UI compartilhado entre telas |
| Formulários | React Hook Form + Zod | Estado e validação de formulários |
| API | Node.js, Express, TypeScript, OpenAPI | Contrato HTTP e regras do sistema |
| Persistência | PostgreSQL + Prisma | Dados transacionais, migrations e consultas |
| Busca vetorial | pgvector, após validação do caso de uso | Similaridade semântica de solicitações |
| Filas | Redis + BullMQ | Enfileirar e executar trabalhos assíncronos |
| Ambiente local | Docker + Docker Compose | Serviços de infraestrutura reproduzíveis |
| Testes | Vitest; React Native Testing Library/Jest Expo; Playwright | Testes por camada e fluxos web essenciais |
| CI | GitHub Actions | Lint, tipos, testes e build em mudanças |

Não usar vários gerenciadores globais em paralelo. Estado local fica nos componentes; TanStack Query representa estado remoto; Zustand fica reservado ao estado global de interface. Autenticação e armazenamento de credenciais terão decisão própria de segurança.

## 4. Arquitetura e padrões de projeto

- **Monólito modular** na API, com módulos de solicitações, usuários/equipes, comentários/histórico e assistência de IA.
- **Worker separado como processo**, no mesmo repositório e domínio de deploy inicial; fila desacopla trabalho lento do pedido HTTP.
- **Casos de uso** para operações com regras de negócio relevantes; controllers traduzem HTTP; validação ocorre na fronteira.
- **Repositórios/adaptadores** somente onde isolam persistência ou integrações com valor de teste/manutenção; evitar abstrações genéricas para CRUD simples.
- **Contrato OpenAPI** como referência de integração dos clientes. Tipos/clientes gerados podem ser adicionados no workspace.
- **Camada de provedor de IA** isolada por uma interface pequena, permitindo trocar fornecedor sem espalhar SDKs e prompts pela aplicação.
- **Saída estruturada e validada** para sugestões de IA; armazenar versão e resultado para revisão e avaliação.
- **Idempotência e retentativas** em jobs; falhas devem poder ser inspecionadas e reprocessadas com segurança.
- Sem microserviços, event streaming ou arquitetura de agentes no primeiro escopo.

## 5. Limites do MVP técnico

### Incluir

- web, mobile, API e worker iniciados do zero;
- PostgreSQL e Redis em ambiente local via Compose;
- fila para pelo menos um processamento assíncrono de IA;
- sugestão de resumo e categoria, a partir de título e descrição, com revisão humana;
- histórico de mudanças e feedback sobre sugestões;
- métricas operacionais básicas, depois de definidas;
- testes de regras, integração da API e fluxo web crítico;
- contrato OpenAPI, migrations e dados fictícios de seed.

### Deixar para etapas posteriores

- busca semântica com embeddings/pgvector até haver dados e critério de avaliação;
- recomendação de equipe, automações e relatórios avançados;
- funcionamento offline completo, push e anexos;
- múltiplos tenants, deploy de alta disponibilidade, Kubernetes e microserviços;
- treino/fine-tuning de modelos e infraestrutura própria de serving;
- plataforma de dados separada ou uso de Kafka/Spark.

## 6. Modelo de dados inicial

Entidades candidatas: `User`, `Team`, `Request`, `Comment`, `RequestEvent`, `AiSuggestion` e, se a busca semântica for aprovada, `RequestEmbedding`. Campos e transições iniciais já foram definidos; relacionamentos, retenção e permissões detalhadas precisam de definição antes das migrations.

## 7. Critérios de aceite do sistema

- Solicitações e atualizações persistem e podem ser consultadas por web e mobile conforme permissão.
- Toda mudança relevante de negócio tem autor e data no histórico.
- Falha ou indisponibilidade do provedor de IA não impede criar, consultar ou atualizar solicitações.
- Uma sugestão gerada é identificável, revisável e não altera sozinha campos operacionais.
- Jobs têm estados rastreáveis e retentativa limitada, sem duplicar efeitos.
- O ambiente local documentado sobe API, worker, PostgreSQL e Redis com Compose.
- OpenAPI descreve os endpoints efetivamente implementados.
- As métricas e avaliações usam dados fictícios ou tratados adequadamente.

## 8. Decisões de produto pendentes

1. O público principal são equipes de operação de empresas; a operação é interna, de atendimento ao cliente ou ambas?
2. Os papéis iniciais são Solicitante e Operador; quais visibilidades e permissões cada um terá?
3. Qual estratégia de login, sessão e gestão de usuários será usada no MVP?
4. Qual provedor/modelo de IA será usado e quais dados poderão ser enviados?
5. Quais métricas serão exibidas e como serão calculadas?
6. Qual critério define qualidade aceitável de resumo/classificação?
7. Qual será o nome final antes de publicação externa?
