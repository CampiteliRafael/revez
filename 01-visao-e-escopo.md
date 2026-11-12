# Revez — visão e escopo do produto

**Status:** visão aprovada como direção; público e papéis iniciais definidos, regras operacionais pendentes.

## Visão

O Revez ajuda pessoas e equipes a registrar e acompanhar solicitações sem perder contexto, responsável ou próximo passo. Uma fila compartilhada, o histórico de alterações e o acesso por web e mobile dão visibilidade ao trabalho. Recursos de IA podem resumir e classificar pedidos para acelerar a triagem; a decisão final permanece com a pessoa responsável.

## Problema e proposta de valor

Solicitações distribuídas por conversas e ferramentas podem perder contexto, prioridade ou responsável durante o encaminhamento. O Revez propõe centralizar o fluxo e tornar explícito o que foi pedido, quem está cuidando e o que acontece em seguida.

| Tema | Definição | Estado |
|---|---|---|
| Problema | Perda de contexto e visibilidade ao encaminhar solicitações | Proposto |
| Público principal | Equipes de operação de empresas | Confirmado; operação interna ou atendimento a clientes ainda precisa ser delimitado |
| Papéis iniciais | Solicitante, que registra e acompanha solicitações; Operador, que faz triagem e atendimento | Confirmados; papéis gerenciados no Keycloak |
| Visibilidade e ações | Ambos veem solicitações da empresa; Solicitante cria e comenta as próprias; Operador comenta, atribui e atualiza todas | Definido para o MVP; detalhes técnicos dos limites da empresa pendentes |
| Autenticação | SSO via Keycloak; grupos identificam Operadores e os demais usuários são Solicitantes | Confirmado para o MVP; configuração de tokens e provedor corporativo pendentes |
| Operação | Ciclo completo da solicitação disponível na web e no mobile | Confirmado para o MVP |
| Valor | Histórico, responsável e próximo passo visíveis em um só fluxo | Proposto |
| Apoio de IA | Sugestão de resumo e categoria, com revisão humana | Definido para o MVP; provedor, retenção e tratamento de conteúdo proibido pendentes |
| Dados | Indicadores operacionais derivados do histórico do produto | Proposto; métricas pendentes |

## Objetivos do projeto

- Construir do zero os clientes web e mobile, API e processamento assíncrono.
- Aplicar React/TypeScript no web, React Native/Expo no mobile e Node/TypeScript na API.
- Demonstrar integração entre aplicações, banco relacional, filas e um recurso de IA útil ao produto.
- Praticar engenharia de dados aplicada: histórico estruturado, métricas operacionais e avaliação de sugestões.
- Manter arquitetura simples o suficiente para ser compreendida e construída incrementalmente.

## Uso responsável de IA

- IA sugere resumo e categoria a partir do título e da descrição; nenhuma alteração é aplicada sem revisão humana.
- A aplicação deve continuar útil quando o provedor estiver indisponível.
- Remover contatos e credenciais reconhecíveis antes do envio; não enviar dados financeiros, de saúde ou anexos. Usar dados demonstrativos fictícios durante desenvolvimento.
- Tornar sugestões identificáveis e permitir aceitar, editar ou rejeitar.
- Registrar modelo/provedor e versão de prompt/configuração usados, resultado e feedback necessário à avaliação, sem guardar conteúdo excessivo.
- Avaliar resultados em exemplos de referência antes de alterar prompts ou modelos; não alegar qualidade sem medição.

## Dados e aprendizado do produto

O sistema começa com dados transacionais no PostgreSQL e eventos de domínio para histórico. Consultas e agregações simples dão origem a indicadores de operação. pgvector pode atender à busca por solicitações semelhantes dentro do próprio PostgreSQL, se a funcionalidade for validada. Não haverá pipeline de big data nem treinamento de modelo no MVP.

## Fora do escopo inicial

Pagamentos, chat em tempo real, push, anexos, offline completo, workflows configuráveis, multi-tenant, microserviços, streaming distribuído, data lake, Kafka/Spark, treino de modelos e automação autônoma de decisões.

## Restrições e princípios

- Resolver necessidades de produto com cada tecnologia escolhida; não adicionar ferramentas sem fluxo correspondente.
- Definir estados de carregamento, sucesso, vazio, erro e processamento assíncrono.
- Manter decisões de acesso na API, não apenas nas interfaces.
- Considerar acessibilidade básica e uso em telas mobile.
- Usar dados fictícios nos exemplos públicos; proteger segredos e dados pessoais.
- Definir as regras de produto antes de fechar schemas, permissões e transições.
