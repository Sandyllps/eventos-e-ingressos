# Eventos e Ingressos

## Sobre o projeto
API REST desenvolvida para o gerenciamento de eventos e ingressos.
Neste primeiro momento, o projeto possui funcionalidades básicas
para consulta e cadastro de eventos.

## Tecnologias utilizadas
- Node.js
- JavaScript

## Funcionalidades
- Listar eventos
- Cadastrar eventos

## Rotas da API
### GET /api/eventos
Retorna a lista de eventos cadastrados.

### POST /api/eventos
Cadastra um novo evento.


## Como executar o projeto
Instalar dependências

npm install



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
