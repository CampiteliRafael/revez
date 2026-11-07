# Revez

**Status:** documentação inicial da solução aprovada; regras de produto ainda em definição  
**Versão das especificações:** 0.4  
**Atualizado em:** 6 de novembro de 2026

Esta pasta é a referência para construir o Revez do zero: cliente web, aplicativo mobile, API, worker de processamento assíncrono, dados e ambiente local. Antes de implementar uma funcionalidade, confira os requisitos, decisões e critérios de aceite. Registre mudanças arquiteturais em `06-decisoes-tecnicas.md`.

O primeiro layout editável para web e mobile está no [Figma](https://www.figma.com/design/VbycOebaX2iUbyfC6WbkLW); veja também as [notas de design](08-design-no-figma.md). O design é uma proposta inicial e depende do fechamento das decisões de produto listadas neste README.

## Objetivo

Construir um sistema para organizar solicitações de trabalho entre pessoas e equipes, desde a abertura até o acompanhamento e a conclusão. O produto terá interfaces web e mobile conectadas à mesma API. Recursos assistidos por IA devem reduzir trabalho repetitivo e apoiar a triagem, mantendo revisão humana para decisões operacionais.

**Revez** é o nome de trabalho do produto. A escolha vem de “revezar”: passar solicitações entre responsáveis sem perder contexto, histórico ou próximo passo. A escolha do nome não representa pesquisa jurídica ou liberação de marca.

## Documentos

1. [Escopo de todos os projetos](00-escopo-do-sistema.md) — aplicações, API, worker, dados e infraestrutura.
2. [Visão e escopo](01-visao-e-escopo.md) — problema, usuários, valor, IA e limites do MVP.
3. [Requisitos](02-requisitos.md) — requisitos funcionais e critérios de aceite.
4. [Arquitetura e diagramas](03-arquitetura-e-diagramas.md) — componentes e fluxos técnicos.
5. [Fluxos de usuário](04-fluxos-de-usuario.md) — jornadas web/mobile e revisão das sugestões de IA.
6. [Qualidade e aceite](05-qualidade-e-aceite.md) — testes, segurança, dados e avaliação de IA.
7. [Decisões técnicas](06-decisoes-tecnicas.md) — stack, arquitetura e decisões pendentes.
8. [Plano de implementação solo](07-plano-de-implementacao.md) — marcos, histórias, critérios de aceite e sequência recomendada.
9. [Design no Figma](08-design-no-figma.md) — telas web/mobile, estados da interface, padrões visuais e decisões pendentes.

## Workspace local

O monorepo usa pnpm workspaces. Com Node.js e Corepack disponíveis, instale as dependências com `corepack pnpm install`. Os projetos ficam em `apps/api`, `apps/web`, `apps/mobile` e `apps/worker`; os pacotes compartilhados ficam em `packages/`. Execute `corepack pnpm check` para lint, checagem de tipos e formatação, ou `corepack pnpm workspace:list` para conferir os pacotes reconhecidos. Os frameworks e comandos específicos de cada aplicação serão adicionados nas respectivas histórias de implementação.

### Serviços locais

É necessário ter Docker com o plugin Docker Compose instalado. Copie `.env.example` para `.env` e ajuste as portas se já estiverem ocupadas. Os valores do exemplo são somente para desenvolvimento local; não os reutilize em ambientes compartilhados ou publicados.

```powershell
Copy-Item .env.example .env
docker compose up -d
docker compose ps
```

O Compose inicia PostgreSQL e Redis, publica as portas somente em `127.0.0.1` e aguarda health checks. Para parar os serviços sem apagar os dados persistidos nos volumes, execute `docker compose down`.

## Como interpretar as especificações

- **Confirmado:** decisão explicitamente aprovada pelo autor.
- **Proposto:** recomendação registrada para orientar o trabalho, ainda sujeita a validação.
- **Pendente:** depende de decisão de produto, regra ou ambiente.
- Não declarar uma funcionalidade como implementada, testada, medida ou publicada antes de verificá-la.
- Dados de demonstração devem ser fictícios. Segredos e credenciais ficam fora do repositório.

## Próximas definições de produto

O público principal, os papéis iniciais (Solicitante e Operador), as regras da solicitação, a função inicial de IA e o ciclo completo em Web e Mobile estão definidos. Autenticação está no MVP, mas estratégia de sessão e permissões ainda faltam; também falta delimitar operação interna versus atendimento a clientes, decidir provedor de IA, retenção e tratamento de conteúdo proibido, e estabelecer critérios de avaliação das sugestões. A métrica inicial será a mediana do tempo corrido entre criação e conclusão, com meta definida após a linha de base do piloto.
