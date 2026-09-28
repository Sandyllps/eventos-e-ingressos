# Eventos e Ingressos

## Sobre o projeto
API REST desenvolvida para o gerenciamento de eventos e ingressos.
Neste primeiro momento, o projeto possui funcionalidades básicas
para consulta e cadastro de eventos.

## Tecnologias utilizadas
- Node.js
- JavaScript
- Express
- Vitest + Supertest (testes e cobertura)
- GitHub Actions (integração contínua)

## Funcionalidades
- Listar eventos
- Cadastrar eventos

## Rotas da API
### GET /eventos
Retorna a lista de eventos cadastrados.

### POST /eventos
Cadastra um novo evento.

## EsLint
É uma ferramenta que analisa o código
@eslint/js   → regras recomendadas do JavaScript
globals      → permite informar ao ESLint que estamos usando ambiente Node.js

## Como executar o projeto
- Instalar dependências:
npm install

- Executar os testes: 
nmp test

- Executar os testes com relatório de cobertura:
npm run coverage

- Instalar o ESLint
npm install --save-dev eslint @eslint/js globals

- Executar o ESLint
npm run lint

## Integração Contínua (CI)

O repositório possui dois workflows de GitHub Actions, localizados em .github/workflows/:

- commit.yml — disparado a cada push em qualquer branch. Clona o repositório, instala o Node.js e as dependências, e roda os testes com cobertura.

- pull-request.yml — disparado quando uma Pull Request é aberta ou atualizada tendo a main como destino. Executa os mesmos passos: instalação e testes com cobertura.

Em ambos os workflows, a cobertura mínima exigida é de 90% (linhas, funções, branches e statements), configurada em vitest.config.js. Se a cobertura ficar abaixo disso, o workflow falha.

## Descrição do ESLint
O ESLint é uma ferramenta utilizada para analisar o código e identificar erros, padrões inconsistentes e problemas de qualidade. Ele ajuda a manter o código mais organizado, padronizado e fácil de manter.


## Workflow
1. Atualizar a branch main local com as alterações do GitHub.
2. Criar uma branch temporária para a tarefa a ser desenvolvida.
3. Desenvolver a alteração nessa branch.
4. Caso a main tenha recebido novas alterações, atualizar a branch de trabalho com a versão mais recente da main.
5. Testar a aplicação e verificar se a alteração funciona sem comprometer as funcionalidades existentes.
6. Fazer commit das alterações e enviá-las ao GitHub.
7. Criar um Pull Request da branch de trabalho para a main.
8. Solicitar revisão de outra integrante da equipe.
9. A revisora analisa as alterações no Pull Request e pode aprovar ou solicitar correções.
10. Após a aprovação, a responsável pela alteração realiza o merge na main.
11. Após confirmar a integração, a branch temporária é excluída.
12. O card correspondente no Kanban é marcado como concluído.


## Por que escolhemos este Workflow?

Adotamos o modelo de **Feature Branch Workflow** (com o uso de ramificações temporárias) pelos seguintes motivos:

* **Isolamento de Recursos:** Cada nova funcionalidade ou correção é desenvolvida em uma branch separada. Isso garante que o código em desenvolvimento não interfira diretamente na versão estável (`main`).
* **Flexibilidade e Agilidade:** Trabalhar com branches temporárias permite que múltiplos integrantes desenvolvam tarefas simultâneas de forma flexível, sem bloquear o progresso dos outros.
* **Garantia de Qualidade:** A obrigatoriedade de Pull Requests e revisões por outros membros da equipe assegura que nenhum código seja integrado sem validação prévia.
* **Ambiente Limpo:** A exclusão da branch temporária após o merge mantém o repositório organizado e livre de códigos obsoletos.


## Integrantes
Ana Francisca

Sandy Lopes

Roberta Késsia