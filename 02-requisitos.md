# Requisitos do sistema Revez

**Status:** requisitos propostos para orientar o MVP; regras de negócio parcialmente definidas.

## Convenções

- `WEB`, `MOB`, `API`, `WRK` e `DAT` identificam o principal responsável pelo requisito.
- **Proposto** indica escopo recomendado ainda sujeito a refinamento funcional.
- A stack e os componentes aprovados estão registrados em `06-decisoes-tecnicas.md`.

## Definição inicial da solicitação (P-02)

Todos os campos abaixo são obrigatórios no momento da criação:

| Campo | Regra inicial |
|---|---|
| Título | Obrigatório |
| Descrição | Obrigatória |
| Categoria | TI, Infraestrutura, Administrativo, Compras ou RH |
| Prioridade | Baixa, Média ou Alta |
| Prazo | Obrigatório |
| Responsável | Operador responsável obrigatório |
| Equipe | Equipe responsável obrigatória |

O ciclo de vida inicial usa os estados **Nova**, **Em andamento**, **Aguardando** e **Concluída**. Uma solicitação começa como Nova e pode transitar de Nova para Em andamento; de Em andamento para Aguardando ou Concluída; e de Aguardando para Em andamento. Solicitações Concluídas não podem ser reabertas no MVP.

Exemplo fictício: “Projetor da sala de reunião não liga”, categoria TI, prioridade Média, prazo 10/11/2026, equipe Suporte interno, responsável Operador A e estado inicial Nova. A descrição informa que o equipamento não liga antes de uma reunião e pede verificação ou indicação de reparo/substituição.

## Diretrizes iniciais de IA (P-03)

- A primeira função sugere um resumo e uma categoria da lista definida em P-02.
- O conteúdo da solicitação enviado para análise limita-se ao título e à descrição. A lista fixa de categorias serve como configuração para restringir a classificação.
- Remover contatos e credenciais reconhecíveis antes do envio. Não enviar informações financeiras, de saúde nem anexos.
- A saída permanece como sugestão: uma pessoa deve aceitar, editar ou rejeitar; nenhum campo da solicitação é alterado automaticamente.
- Provedor/modelo, retenção de dados pelo provedor e a resposta do sistema quando detectar conteúdo proibido continuam pendentes.

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
| API-07 | Enfileirar análise de IA | Após criação ou solicitação explícita, cria job rastreável sem bloquear resposta HTTP | Proposto |
| API-08 | Consultar sugestões | Retorna resumo/categoria e estado da revisão humana | Proposto |
| API-09 | Validar autenticação | API valida credenciais SSO do Keycloak e aplica autorização no servidor | Keycloak confirmado; protocolo e claims pendentes |

### Web

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| WEB-01 | Consultar e filtrar fila | Exibe itens da API e comunica carregamento, vazio e erro | Proposto |
| WEB-02 | Criar solicitação | Valida campos e preserva dados em erros recuperáveis | Campos definidos em P-02 |
| WEB-03 | Consultar/atualizar detalhes | Exibe comentários, histórico e ações permitidas | Proposto |
| WEB-04 | Revisar sugestão de IA | Pessoa pode aceitar, editar ou rejeitar; nenhuma sugestão é aplicada silenciosamente | Escopo MVP confirmado |
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
| WRK-02 | Gerar resumo/classificação | Resultado segue schema validado e fica associado à solicitação | Provedor/modelo pendentes |
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
- Se análises de IA serão automáticas na criação ou acionadas por pessoa.
- Como bloquear ou tratar solicitações com conteúdo proibido e qual política de retenção o provedor terá.
- Indicadores, período, filtros e regras de cálculo.
- Conjunto de avaliação e limite mínimo de qualidade para cada sugestão.

## Critérios integrados de aceite do MVP

1. Criar solicitação em um cliente e consultar no outro com as permissões corretas.
2. Confirmar persistência e evento de histórico após atualização.
3. Processar uma análise de IA em fila e exibir a sugestão para revisão humana.
4. Demonstrar que falha de IA ou fila não impede os fluxos básicos de solicitação.
5. Demonstrar execução local de API, worker, PostgreSQL e Redis com Compose.
6. Validar erros, vazios, carregamento e processamento pendente nos clientes.
7. Manter OpenAPI alinhado à implementação e cobrir fluxos críticos por testes.
