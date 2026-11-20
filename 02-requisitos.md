# Requisitos do sistema Revez

**Status:** requisitos propostos para orientar o MVP; regras de negócio parcialmente definidas.

## Convenções

- `WEB`, `MOB`, `API`, `WRK` e `DAT` identificam o principal responsável pelo requisito.
- **Proposto** indica escopo recomendado ainda sujeito a refinamento funcional.
- A stack e os componentes aprovados estão registrados em `06-decisoes-tecnicas.md`.

## Definição inicial da solicitação (P-02)

Os campos informados pelo Solicitante são obrigatórios no momento da criação:

| Campo | Regra inicial |
|---|---|
| Título | Obrigatório |
| Descrição | Obrigatória |
| Categoria | TI, Infraestrutura, Administrativo, Compras ou RH |
| Prioridade | Baixa, Média ou Alta |
| Prazo | Obrigatório |

O Solicitante é identificado pela identidade autenticada; não é informado no corpo da solicitação. Equipe e responsável não são definidos na criação: a solicitação começa sem atribuição e um Operador atribui a equipe e o responsável depois.

O ciclo de vida inicial usa os estados **Nova**, **Em andamento**, **Aguardando** e **Concluída**. Uma solicitação começa como Nova e pode transitar de Nova para Em andamento; de Em andamento para Aguardando ou Concluída; e de Aguardando para Em andamento. Solicitações Concluídas não podem ser reabertas no MVP.

Exemplo fictício: “Projetor da sala de reunião não liga”, categoria TI, prioridade Média e prazo 10/11/2026, com estado inicial Nova e sem equipe ou responsável atribuídos. Depois da criação, um Operador atribui a equipe Suporte interno e o responsável Operador A. A descrição informa que o equipamento não liga antes de uma reunião e pede verificação ou indicação de reparo/substituição.

## Diretrizes iniciais de IA (P-03)

- Antes do envio, o Solicitante pode acionar explicitamente a revisão de um rascunho pelo botão **Revisar com IA**. Durante a análise, a interface comunica o carregamento e impede uma segunda solicitação de revisão. O resultado aparece em um painel do formulário, separado em contexto possivelmente ausente, perguntas para consideração e propostas de melhoria do texto.
- Cada proposta de texto pode ser aplicada explicitamente ao campo correspondente; apontamentos e perguntas não alteram o rascunho. Não há ação de aceitar tudo: o Solicitante decide o que alterar, pode ignorar o painel e enviar normalmente. A revisão não envia nem persiste a solicitação.
- Falha ou indisponibilidade da revisão apresenta aviso recuperável, preserva o rascunho e não bloqueia o envio.
- Após a criação, a IA pode sugerir um resumo e recomendar categoria, prioridade e equipe para apoiar a triagem do Operador. As recomendações usam o título e a descrição, além das categorias, regras de prioridade e equipes disponíveis como contexto.
- Recomendações de categoria, prioridade e equipe são apresentadas ao Operador para revisão. A IA não altera campos nem atribui equipe ou responsável automaticamente; ações persistidas exigem confirmação humana.
- A análise ocorre fora do caminho crítico da criação. Falha ou indisponibilidade da IA não impede criar, consultar ou atualizar solicitações.
- O conteúdo enviado para análise limita-se ao título e à descrição, após a remoção de contatos e credenciais reconhecíveis. Não enviar informações financeiras, de saúde nem anexos.
- Registrar eventos estruturados de geração e revisão das sugestões para avaliar uso e resultado, como aceitação/edição/rejeição e tempo até primeira atribuição e conclusão, sem armazenar conteúdo desnecessário.
- RAG e uso de solicitações históricas como contexto ficam para uma fase posterior, condicionados a autorização, proteção de acesso e avaliação mensurável de qualidade.
- Ollama local foi escolhido como provedor preferido para desenvolvimento e demonstração; modelo, requisitos mínimos de recursos, tratamento de conteúdo proibido detectado e critérios mínimos de qualidade continuam pendentes. Provedores hospedados dependem de avaliação separada de cotas, custo e política de dados.

## Escopo inicial do MVP (P-04)

- O ciclo de vida da solicitação — criar, consultar fila, abrir detalhes, comentar e atualizar até **Concluída** — deve funcionar tanto na Web quanto no Mobile.
- Web, mobile e API usam SSO via Keycloak. Link de acesso por e-mail não faz parte do MVP.
- O Keycloak gerencia usuários e papéis. Um grupo do Keycloak identifica Operadores; demais usuários autenticados são Solicitantes. O nome do grupo e as claims usadas na integração ainda serão definidos.
- Solicitantes podem criar solicitações, consultar todas as solicitações da empresa e comentar apenas nas que criaram.
- Operadores podem consultar, comentar, atribuir e atualizar todas as solicitações da empresa.
- Ambos os papéis podem consultar solicitações de todas as categorias, inclusive RH.
- A edição de solicitações por Solicitantes, exclusão e definição do limite técnico da empresa ainda precisam de decisão.
- A revisão humana das sugestões de resumo e categoria estará disponível na Web e no Mobile.
- Métrica inicial: mediana de horas corridas entre a criação e a primeira transição da solicitação para **Concluída**. Registrar a linha de base no piloto e definir uma meta depois de observá-la.

## Requisitos funcionais

### API

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| API-01 | Criar solicitação | Valida entrada, persiste registro e devolve identificador e datas | Proposto |
| API-02 | Consultar fila | Retorna resultados paginados de solicitações da empresa do usuário autenticado | Visibilidade por papel definida; limite técnico da empresa pendente |
| API-03 | Consultar detalhes | Retorna campos, comentários e histórico acessíveis | Proposto |
| API-04 | Atualizar solicitação | Valida transição e permissão; persiste alteração e evento | Operadores podem atualizar solicitações da empresa; transições definidas |
| API-05 | Registrar comentário | Valida conteúdo/acesso e associa autor e data | Solicitantes comentam as próprias solicitações; Operadores comentam todas as da empresa |
| API-06 | Publicar contrato OpenAPI | Contrato acompanha endpoints, schemas e erros implementados | Proposto |
| API-07 | Solicitar análise de IA | Revisão explícita de rascunho retorna sugestões estruturadas sem persistir o rascunho; triagem pós-criação é enfileirada sem bloquear a resposta HTTP | Proposto |
| API-08 | Consultar sugestões | Retorna resumo/categoria e estado da revisão humana | Proposto |
| API-09 | Validar autenticação | API valida credenciais SSO do Keycloak e aplica autorização no servidor | Keycloak confirmado; protocolo e claims pendentes |

### Web

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| WEB-01 | Consultar e filtrar fila | Exibe itens da API e comunica carregamento, vazio e erro | Proposto |
| WEB-02 | Criar solicitação | Valida campos e preserva dados em erros recuperáveis | Campos definidos em P-02 |
| WEB-03 | Consultar/atualizar detalhes | Exibe comentários, histórico e ações permitidas | Proposto |
| WEB-04 | Revisar sugestão de IA | Botão inicia revisão opcional e informa carregamento; painel apresenta apontamentos, perguntas e propostas de texto; cada proposta é aplicada ao campo apenas por ação explícita; usuário pode ignorar o painel e enviar; falha não bloqueia o envio | Escopo MVP confirmado |
| WEB-05 | Exibir indicadores | Mostra métricas definidas e período/filtros de cálculo | Métrica de sucesso inicial definida; indicadores adicionais pendentes |
| WEB-06 | Autenticar | Encaminha ao SSO do Keycloak e retorna ao fluxo com sessão autenticada | Escopo MVP confirmado; configuração pendente |

### Mobile

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| MOB-01 | Consultar fila | Lista legível em telas mobile com estados de espera, vazio e erro | Proposto |
| MOB-02 | Pesquisar e abrir detalhes | Filtros aprovados funcionam; detalhes mostram histórico e comentários | Proposto |
| MOB-03 | Criar solicitação | Valida os campos e apresenta confirmação ou erro recuperável | Proposto |
| MOB-04 | Atualizar/comentar | Operadores atualizam solicitações da empresa; Solicitantes comentam apenas as próprias; API valida as permissões | Regras por papel definidas |
| MOB-05 | Consultar sugestão de IA | Exibe sugestão e permite revisão humana conforme fluxo aprovado | Escopo MVP confirmado |
| MOB-06 | Autenticar | Encaminha ao SSO do Keycloak e retorna ao fluxo com sessão autenticada | Escopo MVP confirmado; configuração pendente |

### Worker e IA

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| WRK-01 | Processar jobs assíncronos | Job tem estado observável e tentativas limitadas; API segue disponível | Proposto |
| WRK-02 | Gerar resumo/classificação | Resultado segue schema validado e fica associado à solicitação | Ollama local selecionado; modelo pendente |
| WRK-03 | Tratar falha de IA | Erro não altera nem apaga a solicitação; falha pode ser consultada e reprocessada | Proposto |
| WRK-04 | Evitar efeitos duplicados | Reexecução do mesmo job não duplica sugestões/eventos nem muda decisão humana | Proposto |
| WRK-05 | Registrar feedback de revisão | Aceite, edição ou rejeição fica ligado à versão da sugestão | Proposto |

### Dados

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| DAT-01 | Registrar eventos do domínio | Alterações relevantes guardam entidade, ação, autor e instante | Proposto |
| DAT-02 | Expor métricas operacionais | Cálculos documentados e reconciliáveis com dados de origem | Métricas pendentes |
| DAT-03 | Avaliar sugestões | Conjunto de referência permite comparar resultado e feedback por versão | Proposto |
| DAT-04 | Busca semântica | Solicitações semelhantes podem ser encontradas usando pgvector quando aprovada | Fase posterior |

## Requisitos não funcionais

| ID | Requisito | Critério de aceite |
|---|---|---|
| RNF-01 | Fonte única de dados | Web e mobile leem/escrevem pela API e observam dados persistidos |
| RNF-02 | Segurança | API valida identidade e papéis do Keycloak e aplica autorização no servidor; segredos fora do git |
| RNF-03 | Resiliência da IA | Falha de Redis, worker ou provedor não bloqueia funções transacionais essenciais |
| RNF-04 | Integridade do histórico | Mudanças relevantes guardam autor, ação e data, conforme regra de retenção definida |
| RNF-05 | Dados mínimos | Enviar à IA apenas título e descrição após remover contatos/credenciais reconhecíveis; não enviar dados financeiros, de saúde ou anexos; desenvolvimento usa dados fictícios |
| RNF-06 | Observabilidade | Logs estruturados permitem correlacionar solicitação e job sem expor conteúdo sensível |
| RNF-07 | Acessibilidade | Controles essenciais têm rótulos e suporte a foco/leitor de tela |
| RNF-08 | Ambiente reproduzível | README permite subir dependências locais com Docker Compose |
| RNF-09 | Qualidade | Lint, checagem de tipos e testes essenciais rodam localmente e no CI |

## Regras de produto a definir

- Delimitação entre operação interna e atendimento a clientes; limite técnico da empresa.
- Edição de solicitações por Solicitantes, exclusão, arquivamento e retenção do histórico.
- Protocolo SSO, claims de token, nome do grupo de Operadores e configuração do provedor corporativo no Keycloak.
- Como bloquear ou tratar solicitações com conteúdo proibido e qual política de retenção o provedor terá.
- Indicadores operacionais, período, filtros e regras de cálculo; definir também como medir a utilidade das sugestões de IA.
- Conjunto de avaliação e limite mínimo de qualidade para cada sugestão; avaliar uso de RAG antes de incluí-lo.

## Critérios integrados de aceite do MVP

1. Criar solicitação em um cliente e consultar no outro com as permissões corretas.
2. Confirmar persistência e evento de histórico após atualização.
3. Processar uma análise de IA em fila e exibir a sugestão para revisão humana.
4. Demonstrar que falha de IA ou fila não impede os fluxos básicos de solicitação.
5. Demonstrar o ambiente local planejado com Web, API, PostgreSQL, Redis, Keycloak e Ollama em Compose; incluir Worker no Compose quando implementado.
6. Validar erros, vazios, carregamento e processamento pendente nos clientes.
7. Manter OpenAPI alinhado à implementação e cobrir fluxos críticos por testes.
