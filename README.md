# Eventos e Ingressos

## Sobre o projeto

API REST desenvolvida para o gerenciamento de eventos e ingressos.

## Tecnologias utilizadas

* Node.js
* JavaScript
* Express
* Vitest + Supertest
* ESLint
* GitHub Actions

## Funcionalidades

* Listar eventos
* Cadastrar eventos
* Excluir eventos
* Interface web simples para facilitar o uso e a demonstração da API

## Rotas da API

### GET /eventos

Retorna a lista de eventos cadastrados.

### POST /eventos

Cadastra um novo evento.

### DELETE /eventos/:id

Exclui um evento pelo ID informado.

Caso o evento não exista, a API retorna o status `404`.

## Testes

O projeto possui testes unitários e de integração.

A cobertura é verificada pelo Vitest, com mínimo de 90% para:

* Linhas
* Funções
* Branches
* Statements

## ESLint

O ESLint é utilizado para analisar o código e verificar padrões de formatação e qualidade.

A execução é feita com:

```bash
npm run lint
```

## Como executar o projeto

Instalar as dependências:

```bash
npm install
```

Executar os testes:

```bash
npm test
```

Executar os testes com cobertura:

```bash
npm run coverage
```

Executar o ESLint:

```bash
npm run lint
```

Para utilizar a interface web, execute o projeto com:

```bash
node index.js
```

Depois, acesse:

```text
http://localhost:8080
```

## Integração Contínua (CI)

O repositório possui dois workflows de GitHub Actions, localizados em `.github/workflows/`:

* `commit.yml` — executado a cada push em qualquer branch.
* `pull-request.yml` — executado quando uma Pull Request tem a `main` como destino.

Os workflows realizam testes, verificação de cobertura e análise com ESLint.

## Workflow

1. Atualizar a branch `main` local com as alterações do GitHub.
2. Criar uma branch para a tarefa.
3. Desenvolver a alteração nessa branch.
4. Testar a aplicação.
5. Fazer commit das alterações e enviá-las ao GitHub.
6. Criar um Pull Request da branch para a `main`.
7. Solicitar revisão de outra integrante da equipe.
8. Após a aprovação, realizar o merge na `main`.
9. Excluir a branch após o merge.

## Integrantes

Ana Francisca

Sandy Lopes

Roberta Késsia
