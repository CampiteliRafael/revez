# Requisitos do sistema Revez

**Status:** requisitos propostos para orientar o MVP; regras de negócio aguardam definição.

## Convenções

- `WEB`, `MOB`, `API`, `WRK` e `DAT` identificam o principal responsável pelo requisito.
- **Proposto** indica escopo recomendado ainda sujeito a refinamento funcional.
- A stack e os componentes aprovados estão registrados em `06-decisoes-tecnicas.md`.

## Requisitos funcionais

### API

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| API-01 | Criar solicitação | Valida entrada, persiste registro e devolve identificador e datas | Proposto |
| API-02 | Consultar fila | Retorna resultados paginados e somente visíveis ao usuário | Permissões/filtros pendentes |
| API-03 | Consultar detalhes | Retorna campos, comentários e histórico acessíveis | Proposto |
| API-04 | Atualizar solicitação | Valida transição e permissão; persiste alteração e evento | Regras pendentes |
| API-05 | Registrar comentário | Valida conteúdo/acesso e associa autor e data | Proposto |
| API-06 | Publicar contrato OpenAPI | Contrato acompanha endpoints, schemas e erros implementados | Proposto |
| API-07 | Enfileirar análise de IA | Após criação ou solicitação explícita, cria job rastreável sem bloquear resposta HTTP | Proposto |
| API-08 | Consultar sugestões | Retorna resumo/categoria e estado da revisão humana | Proposto |

### Web

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| WEB-01 | Consultar e filtrar fila | Exibe itens da API e comunica carregamento, vazio e erro | Proposto |
| WEB-02 | Criar solicitação | Valida campos e preserva dados em erros recuperáveis | Campos pendentes |
| WEB-03 | Consultar/atualizar detalhes | Exibe comentários, histórico e ações permitidas | Proposto |
| WEB-04 | Revisar sugestão de IA | Pessoa pode aceitar, editar ou rejeitar; nenhuma sugestão é aplicada silenciosamente | Proposto |
| WEB-05 | Exibir indicadores | Mostra métricas definidas e período/filtros de cálculo | Métricas pendentes |

### Mobile

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| MOB-01 | Consultar fila | Lista legível em telas mobile com estados de espera, vazio e erro | Proposto |
| MOB-02 | Pesquisar e abrir detalhes | Filtros aprovados funcionam; detalhes mostram histórico e comentários | Proposto |
| MOB-03 | Criar solicitação | Valida os campos e apresenta confirmação ou erro recuperável | Proposto |
| MOB-04 | Atualizar/comentar | Ações autorizadas persistem na API e refletem o resultado | Permissões pendentes |
| MOB-05 | Consultar sugestão de IA | Exibe sugestão e permite revisão humana conforme fluxo aprovado | Proposto |

### Worker e IA

| ID | Requisito | Critério de aceite | Estado |
|---|---|---|---|
| WRK-01 | Processar jobs assíncronos | Job tem estado observável e tentativas limitadas; API segue disponível | Proposto |
| WRK-02 | Gerar resumo/classificação | Resultado segue schema validado e fica associado à solicitação | Provedor/campos pendentes |
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
| RNF-02 | Segurança | API aplica autenticação/autorização no servidor; segredos fora do git |
| RNF-03 | Resiliência da IA | Falha de Redis, worker ou provedor não bloqueia funções transacionais essenciais |
| RNF-04 | Integridade do histórico | Mudanças relevantes guardam autor, ação e data, conforme regra de retenção definida |
| RNF-05 | Dados mínimos | Só enviar à IA dados necessários; desenvolvimento usa dados fictícios |
| RNF-06 | Observabilidade | Logs estruturados permitem correlacionar solicitação e job sem expor conteúdo sensível |
| RNF-07 | Acessibilidade | Controles essenciais têm rótulos e suporte a foco/leitor de tela |
| RNF-08 | Ambiente reproduzível | README permite subir dependências locais com Docker Compose |
| RNF-09 | Qualidade | Lint, checagem de tipos e testes essenciais rodam localmente e no CI |

## Regras de produto a definir

- Público, papéis, visibilidade e matriz de permissões.
- Campos obrigatórios, categorias, prioridades, estados e transições.
- Regras de atribuição, edição, arquivamento e retenção do histórico.
- Se análises de IA serão automáticas na criação ou acionadas por pessoa.
- Dados permitidos para envio ao provedor de IA e política de retenção.
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
