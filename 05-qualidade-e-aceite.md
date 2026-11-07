# Qualidade e critérios de aceite

**Status:** estratégia inicial proposta; ferramentas escolhidas como direção técnica.

## Definição de pronto

- Atende critérios de aceite do requisito e regras de autorização no servidor.
- Comunica estados de carregamento, vazio, sucesso, erro e job pendente quando aplicável.
- Inclui testes proporcionais ao risco e atualiza contrato/diagramas afetados.
- Não expõe segredos nem envia dados desnecessários a serviços externos.
- As interfaces essenciais foram verificadas em tamanhos de tela adequados e com acessibilidade básica.
- Jobs não duplicam efeitos quando repetidos e falhas são observáveis.

## Estratégia de testes

| Camada | Cobertura proposta | Ferramenta |
|---|---|---|
| Unitário API/worker | Casos de uso, regras, validações e idempotência | Vitest |
| Integração API | Endpoints, PostgreSQL e persistência/eventos | Vitest + Supertest |
| Componentes web | Estados e interações principais | React Testing Library + Vitest |
| Mobile | Componentes e navegação essencial | React Native Testing Library + Jest Expo |
| Ponta a ponta web | Criar e acompanhar solicitação, revisar sugestão | Playwright |
| IA | Schema, exemplos de referência e regressão entre versões | Harness versionado do projeto; ferramenta a decidir |
| Manual | Acessibilidade, emuladores, rede lenta e recuperação | Dispositivos/emuladores a definir |

## Qualidade e avaliação de IA

- Validar toda resposta do modelo contra schema esperado; resposta inválida vira falha controlada.
- Criar conjunto versionado de exemplos fictícios com rótulos de referência para resumo/classificação.
- Acompanhar indicadores adequados ao recurso, como correspondência de categoria e taxa de sugestões aceitas/editadas/rejeitadas; definir limites somente após estabelecer baseline.
- Comparar mudanças de prompt/modelo no conjunto de referência antes de disponibilizar.
- Registrar versão do modelo/configuração, tempo, estado e feedback humano; evitar logar texto sensível integralmente.
- Monitorar timeout, indisponibilidade e retentativas; nunca deixar a falha da IA impedir a operação transacional.
- Não alegar precisão, economia de tempo ou qualidade sem medição e contexto registrados.

## Qualidade de dados

- Definir significado, unidade e período para cada métrica operacional.
- Conferir totais agregados contra registros transacionais de origem.
- Guardar histórico de forma consistente e proteger regras de retenção.
- Usar dados fictícios no desenvolvimento público; remover ou minimizar dados pessoais em qualquer avaliação externa.
- Embeddings, se adotados, devem ser regeneráveis a partir de conteúdo permitido e metadados de versão.

## Checklist de operação local e CI

- Docker Compose inicia PostgreSQL e Redis com health checks e volumes locais adequados.
- Migrations e seed são repetíveis; seed contém dados sintéticos.
- API e worker iniciam com configuração documentada e falham com mensagem clara quando dependências faltam.
- Logs correlacionam solicitação e job com identificador, sem registrar credenciais ou conteúdo sensível desnecessário.
- GitHub Actions executa lint, checagem de tipos, testes e builds relevantes.
- `.env.example` documenta nomes de configuração sem valores secretos.

## Critérios de aceite técnicos

1. Criar uma solicitação persiste mesmo com o provedor de IA indisponível.
2. Job enfileirado pode ser processado por worker e consultado por estado.
3. Repetição de job não duplica sugestão ou histórico.
4. Sugestão fica pendente de revisão; aceitar/editar/rejeitar cria registro rastreável.
5. Erros de API, banco, Redis e provedor têm comportamento previsível e logs seguros.
6. O fluxo web essencial e os casos de uso críticos têm testes automatizados.
