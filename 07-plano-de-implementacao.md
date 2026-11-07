# Plano de implementação para desenvolvedor solo

**Status:** plano inicial proposto com base no escopo aprovado.  
**Abordagem:** entrega incremental por fatias verticais; evitar iniciar web, mobile, IA e infraestrutura avançada ao mesmo tempo.

## Princípios de execução

1. Manter somente uma história principal em andamento. Limitar tarefas paralelas a documentação, design ou pesquisa curta.
2. Entregar cada etapa executável e demonstrável antes de ampliar escopo.
3. Construir primeiro um fluxo ponta a ponta na web, depois adaptar os fluxos essenciais para mobile.
4. Usar Docker Compose desde a fundação para PostgreSQL e Redis, sem exigir que web/mobile rodem dentro dos containers.
5. Colocar a IA atrás de uma interface e numa fila; deixar a operação básica útil antes de ligar um provedor externo.
6. Não introduzir papéis, estados, métricas ou automações que ainda não tenham regra de produto aprovada.
7. Rever escopo ao fim de cada marco. Se uma história exceder alguns dias de trabalho individual, dividi-la.

## Sequência de marcos

| Marco | Resultado verificável | Pronto quando |
|---|---|---|
| M0 — Produto e design | Fluxos, regras mínimas e layout web/mobile aprovados | Campos, status, papéis e jornadas do MVP definidos |
| M1 — Fundação executável | Monorepo, API, PostgreSQL, Redis e Compose | Todos iniciam localmente; lint/tipos/CI passam |
| M2 — Fluxo web sem IA | Criar, listar, abrir e atualizar solicitações | Persistência, validação, histórico e testes de API/web funcionam |
| M3 — Mobile essencial | Consultar, criar e acompanhar no app | Mobile usa a mesma API e cobre estados de erro/carregamento |
| M4 — IA em fila | Resumo/categoria sugeridos e revisados por pessoa | Worker processa, falhas são recuperáveis e feedback fica registrado |
| M5 — Dados e acabamento | Métricas básicas, segurança, documentação e demo | Métricas têm definição; fluxo integrado demonstrável |

## Backlog priorizado

### Épico 0 — Fechar regras de produto

| ID | História | Critérios de aceite | Dependências / tamanho |
|---|---|---|---|
| P-01 | Como responsável pelo produto, quero definir quem usa o Revez para que permissões e telas correspondam a um contexto real. | Público principal: equipes de operação de empresas. Papéis iniciais: Solicitante, que registra e acompanha solicitações, e Operador, que faz triagem e atendimento. | Nenhuma / S — definição inicial concluída; visibilidade e permissões detalhadas continuam pendentes |
| P-02 | Quero definir campos, status, prioridades e transições para que solicitações tenham ciclo de vida explícito. | Sete campos obrigatórios na criação; categorias TI, Infraestrutura, Administrativo, Compras e RH; prioridades Baixa, Média e Alta; estados e transições iniciais registrados em `02-requisitos.md`, com exemplo fictício. | P-01 / S — definição inicial concluída |
| P-03 | Quero definir a primeira função de IA e dados enviados para que a automação seja útil e segura. | Resumo e categoria sugeridos a partir do título e descrição; contatos/credenciais reconhecíveis removidos; dados financeiros, de saúde e anexos proibidos; revisão humana obrigatória e sem alteração automática de campos. | P-01, P-02 / S — definição inicial concluída; provedor, retenção e tratamento de conteúdo proibido detectado pendentes |
| P-04 | Quero escolher critérios do MVP e métrica de sucesso para limitar o trabalho. | Ciclo completo de solicitações e revisão de IA em Web e Mobile, com autenticação; métrica definida como mediana de horas corridas entre criação e conclusão, com meta após linha de base do piloto. | P-01 a P-03 / S — escopo inicial definido; estratégia de autenticação e permissões pendentes |

### Épico 1 — Fundação de engenharia

| ID | História | Critérios de aceite | Dependências / tamanho |
|---|---|---|---|
| F-01 | Como desenvolvedor, quero criar monorepo com pnpm workspaces para manter apps e contratos versionados juntos. | `apps/web`, `apps/mobile`, `apps/api`, `apps/worker` e `packages` têm limites claros; scripts básicos documentados. | P-04 / M |
| F-02 | Quero configurar TypeScript, lint, format e checagem de tipos para detectar problemas cedo. | Um comando local executa verificações de cada app; configurações compartilhadas são pequenas. | F-01 / S |
| F-03 | Quero subir PostgreSQL e Redis com Docker Compose para reproduzir o ambiente local. | Compose inicia serviços com health checks e volumes; `.env.example` e instrução de inicialização estão documentados. | F-01 / S |
| F-04 | Quero preparar CI no GitHub Actions para validar as mudanças. | Pipeline executa lint, tipos e testes; falha se qualquer etapa obrigatória falhar. | F-02 / S |
| F-05 | Quero criar migrations e seed fictício para iniciar desenvolvimento com dados previsíveis. | Migrations aplicam em banco vazio; seed pode ser repetido sem duplicar dados. | F-03, domínio de P-02 / M |

### Épico 2 — API e regra central

| ID | História | Critérios de aceite | Dependências / tamanho |
|---|---|---|---|
| A-01 | Como cliente, quero criar uma solicitação via API para registrar trabalho. | Payload validado com Zod; resposta documentada; solicitação e evento inicial persistidos. | F-05 / M |
| A-02 | Quero consultar fila paginada e filtrada para localizar trabalho. | Ordenação padrão e filtros definidos; resultados não ultrapassam limite por página. | A-01 / M |
| A-03 | Quero consultar detalhes, comentários e histórico para entender o contexto. | Endpoint retorna dados autorizados e eventos ordenados; OpenAPI atualizado. | A-01 / S |
| A-04 | Quero atualizar campos permitidos e comentar para acompanhar o andamento. | API valida transição e permissão; salva alteração e evento; erros têm formato consistente. | P-02, A-03 / M |
| A-05 | Quero testes de integração da API para proteger regras e persistência. | Casos de sucesso e falhas principais cobrem criar, filtrar, detalhar e atualizar. | A-01 a A-04 / M |

### Épico 3 — Web primeiro

| ID | História | Critérios de aceite | Dependências / tamanho |
|---|---|---|---|
| W-01 | Como atendente, quero entrar na fila web para ver solicitações e estado geral. | Lista consome API real; estados carregando, vazio, erro e sucesso têm apresentação. | A-02 / M |
| W-02 | Quero pesquisar e filtrar a lista para achar itens relevantes. | Filtros combinam conforme decisão de produto, podem ser limpos e aparecem na URL quando fizer sentido. | W-01 / S |
| W-03 | Quero abrir detalhes para consultar descrição, autor, responsável, comentários e histórico. | Detalhe funciona com atualização/recarregamento e trata recurso não encontrado. | A-03, W-01 / M |
| W-04 | Quero criar uma solicitação para registrar trabalho sem sair do fluxo. | Formulário valida campos, mostra erros e confirmação; falha recuperável não apaga os valores. | A-01 / M |
| W-05 | Quero comentar e atualizar campos permitidos para manter andamento visível. | Mutação atualiza a tela a partir da resposta da API; erro permite nova tentativa segura. | A-04, W-03 / M |
| W-06 | Quero testar o fluxo web principal automaticamente para evitar regressões. | Playwright cobre criar, localizar e abrir solicitação em ambiente de teste. | W-01 a W-04 / M |

### Épico 4 — Mobile essencial

| ID | História | Critérios de aceite | Dependências / tamanho |
|---|---|---|---|
| M-01 | Como usuário, quero abrir o app e consultar solicitações em uma lista mobile. | Expo Router navega para fila; a lista usa a API e mantém estados de carregamento, vazio e erro. | A-02, F-01 / M |
| M-02 | Quero abrir detalhes e acompanhar histórico/comentários no celular. | Conteúdo é legível em viewport acordado; navegação de voltar preserva contexto da fila quando viável. | A-03, M-01 / M |
| M-03 | Quero criar uma solicitação no mobile para registrar trabalho em movimento. | Validação e retorno de sucesso/erro; não perde entrada em erro recuperável. | A-01, M-01 / M |
| M-04 | Quero executar ações autorizadas no mobile. | Comentário/atualização usa os mesmos contratos e regras da API. | A-04, M-02 / M |
| M-05 | Quero testar componentes e navegação mobile nos fluxos essenciais. | Testes cobrem estados e interação principal; execução documentada em emulador/dispositivo disponível. | M-01 a M-04 / M |

### Épico 5 — Fila e IA assistiva

| ID | História | Critérios de aceite | Dependências / tamanho |
|---|---|---|---|
| I-01 | Como API, quero enfileirar um job de análise sem atrasar a resposta da criação. | API retorna solicitação e estado pendente; job contém apenas identificadores/dados mínimos. | F-03, A-01 / M |
| I-02 | Como worker, quero processar um job e persistir resultado estruturado. | Worker valida entrada/saída, registra estado e modelo/configuração; job repetido não duplica resultado. | I-01, P-03 / L |
| I-03 | Quero tratar timeout, falha do provedor e retentativas de forma observável. | Limite de tentativas configurado; falha aparece no estado do job; operação principal continua disponível. | I-02 / M |
| I-04 | Como atendente, quero ver resumo/categoria sugeridos e decidir o que fazer. | Sugestão identificada como IA; pessoa aceita, edita ou rejeita; sistema registra feedback. | I-02, W-03 / M |
| I-05 | Quero consultar estado e resultado da análise em mobile. | Mobile mostra pendente, pronta e falha; revisão fica limitada às ações aprovadas. | I-04, M-02 / S |
| I-06 | Quero avaliar sugestões usando exemplos de referência. | Dataset fictício versionado e script/relatório simples com comparação por versão; sem alegações sem evidência. | P-03, I-02 / M |

### Épico 6 — Dados, segurança e demonstração

| ID | História | Critérios de aceite | Dependências / tamanho |
|---|---|---|---|
| D-01 | Como responsável, quero indicadores operacionais básicos para entender a fila. | Métricas definidas, período visível, consultas coerentes com registros e estado sem dados tratado. | P-04, A-02 / M |
| D-02 | Quero guardar eventos relevantes para reconstruir o histórico. | Cada evento contém entidade, ação, instante e ator conforme as regras aprovadas. | A-01, A-04 / S |
| D-03 | Quero proteger acesso e dados de integração. | Autorização verificada no servidor; segredos fora do repositório; payload enviado à IA limitado. | P-01, P-03 / M |
| D-04 | Quero documentar execução e decisões para que outra pessoa consiga reproduzir a demo. | README explica instalar, configurar, subir Compose, migrar, popular e iniciar cada app; inclui limitações conhecidas. | F-01 a I-04 / S |
| D-05 | Quero demonstrar o sistema com dados fictícios sem depender de ambiente produtivo. | Seed reproduz cenário completo; web/mobile/API/worker demonstráveis localmente. | D-01 a D-04 / M |

## Ordem recomendada de implementação

`P-01…P-04 → F-01…F-05 → A-01…A-05 → W-01…W-06 → M-01…M-05 → I-01…I-06 → D-01…D-05`.

Há dependências que podem ser ajustadas conforme a disponibilidade de ambiente, mas manter a sequência reduz o risco de construir três interfaces antes de validar o contrato e o domínio.

## Política de escopo para uma pessoa

- Fazer primeiro apenas web responsiva; iniciar mobile depois que API e fluxo web estiverem estáveis.
- Começar com uma análise que sugere resumo e categoria; não ampliar para outras funções de IA antes da avaliação funcional.
- Redis/BullMQ entram desde a fundação por decisão do projeto, mas o worker só ganha lógica de IA no épico 5.
- Deixar embeddings/pgvector, notificações, anexos, offline completo e dashboards avançados fora do MVP.
- Não iniciar próxima história enquanto a atual não tiver critério de aceite verificado e documentação essencial atualizada.
- Se uma história “M” passar de alguns dias, reduzi-la a uma fatia demonstrável e adiar o restante.

## Estimativa

Tamanhos `S/M/L` representam esforço relativo individual, não horas garantidas. O plano contém cerca de 30 histórias e pode levar aproximadamente 10–16 semanas em dedicação parcial, dependendo da disponibilidade semanal, decisões de produto, integração com o provedor de IA e necessidade de ajuste do escopo. Reestimar após M1 e M2 com base na velocidade real.
