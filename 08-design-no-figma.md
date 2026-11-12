# Design do Revez no Figma

**Arquivo:** [Revez — Produto Web e Mobile](https://www.figma.com/design/VbycOebaX2iUbyfC6WbkLW)
**Página:** Revez — Produto
**Status:** primeira proposta visual criada; revisar as regras de produto antes de iniciar a implementação visual definitiva.

O arquivo contém frames editáveis, com componentes de interface reutilizáveis. O design cobre os principais fluxos de trabalho web e mobile e os estados que precisam ser comunicados ao usuário.

## Telas e pranchetas

| Frame | Plataforma | Conteúdo |
|---|---|---|
| `00 — Revez UI foundations` | Base visual | Paleta, tipografia e exemplos de botão, campo, área de texto e seletor. |
| `WEB 01 — Fila de solicitações` | Web | Navegação, indicadores, busca/filtros e lista de solicitações. |
| `WEB 02 — Detalhe e sugestão de IA` | Web | Contexto da solicitação, histórico e revisão humana de sugestão. |
| `WEB 03 — Criar solicitação` | Web | Formulário de criação de solicitação. |
| `WEB 04 — Visão geral` | Web | Indicadores, tendências, distribuição por estado e itens que requerem atenção. |
| `MOBILE 01 — Fila` | Mobile | Lista compacta para consulta em celular. |
| `MOBILE 02 — Detalhe` | Mobile | Detalhes, andamento e histórico. |
| `MOBILE 03 — Nova solicitação` | Mobile | Formulário de criação adaptado a celular. |
| `MOBILE 04 — Revisar sugestão de IA` | Mobile | Revisão da sugestão com ações explícitas. |
| `UI STATES — vazio, erro e processamento` | Web e mobile | Lista vazia, falha com nova tentativa, análise pendente e erro do processamento de IA. |

## Direção visual

- Interface clara, com fundo neutro e verde escuro como cor de identidade; tipografia Inter.
- Hierarquia visual simples, espaços consistentes, contraste e controles familiares.
- A sugestão da IA aparece identificada e separada da informação confirmada; aceitar, editar ou rejeitar continua sendo ação humana.
- A versão mobile prioriza leitura e ações essenciais em telas estreitas.
- Os componentes importados da biblioteca de design permanecem editáveis no Figma.

## Fluxos cobertos

1. Consultar e filtrar solicitações na web.
2. Abrir uma solicitação, entender seu histórico e revisar uma sugestão assistida por IA.
3. Criar uma solicitação na web ou no celular.
4. Consultar lista e detalhe no celular.
5. Entender os estados vazio, carregando/processando e erro, com caminho de recuperação quando aplicável.

## Premissas e pontos a validar

- Os números e tendências da visão geral são conteúdo ilustrativo. Definir e validar fórmulas, janela de tempo, fuso e permissões antes de ligar aos dados reais.
- As telas podem conter textos e exemplos visuais que não correspondam às regras iniciais de campos, status, prioridades e transições definidas em `02-requisitos.md`; os critérios documentados prevalecem. Visibilidade e permissões dos papéis ainda dependem de aprovação.
- Os frames de IA mostram resumo e categoria como sugestões revisáveis, geradas a partir de título e descrição; provedor, retenção, tratamento de conteúdo proibido detectado e avaliação permanecem decisões pendentes.
- SSO via Keycloak está no escopo do MVP, mas telas de login/recuperação, convite/membros da equipe, configurações e administração não estão desenhadas. A integração visual com o provedor e detalhes técnicos do fluxo ainda precisam ser definidos.
- O protótipo não define comportamento de acessibilidade por completo. Ao implementar, validar navegação por teclado, leitor de tela, foco, contraste e áreas de toque.

## Próximo uso na implementação

Fechar primeiro as decisões P-01 a P-04 do [plano de implementação](07-plano-de-implementacao.md). Depois, implementar a fila, criação e detalhe como uma fatia vertical web; validar com dados reais de desenvolvimento e atualizar o design se as regras aprovadas alterarem campos ou ações. O mobile vem após estabilizar o contrato e o fluxo principal da API.
