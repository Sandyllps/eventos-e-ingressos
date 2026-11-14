# Eventos e Ingressos

## Sobre o projeto

API REST desenvolvida para o gerenciamento de eventos e ingressos.

## Tecnologias utilizadas

- Node.js
- JavaScript
- Express
- Vitest + Supertest
- ESLint
- GitHub Actions

## Funcionalidades

- Listar eventos
- Cadastrar eventos
- Excluir eventos
- Interface web simples para facilitar o uso e a demonstração da API

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

- Linhas
- Funções
- Branches
- Statements

## ESLint

O ESLint é utilizado para analisar o código e verificar padrões de formatação e qualidade.

A execução é feita com:

```bash
npm run lint
```

## DockerHub

A imagem Docker da aplicação Eventos e Ingressos está disponível no DockerHub:

[![Docker Pulls](https://img.shields.io/docker/pulls/sandyllps/eventos-e-ingressos)](https://hub.docker.com/r/sandyllps/eventos-e-ingressos)

[Visualizar repositório no DockerHub](https://hub.docker.com/r/sandyllps/eventos-e-ingressos)

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

## Infraestrutura com Vagrant

O projeto utiliza o Vagrant e o VirtualBox para configurar duas máquinas virtuais Ubuntu 22.04, permitindo testar a comunicação entre uma máquina cliente e uma máquina servidora.

### Pré-requisitos

Antes de iniciar, é necessário instalar:

- Oracle VirtualBox
- HashiCorp Vagrant

### Máquinas virtuais

| Máquina | Função | Endereço IP | Memória |
|---|---|---|---|
| VM1 | Cliente | 192.168.56.10 | 1024 MB |
| VM2 | Servidora | 192.168.56.11 | 1024 MB |

### Iniciar as máquinas

Na pasta do projeto, execute:

```bash
vagrant up --provider=virtualbox
```

Para verificar o estado das máquinas:

```bash
vagrant status
```

### Acessar as máquinas

Para acessar a máquina cliente:

```bash
vagrant ssh vm1
```

Para acessar a máquina servidora:

```bash
vagrant ssh vm2
```

A VM2 executa a API automaticamente por meio de um serviço chamado `eventos-e-ingressos`.

### Configurar a VM2 com Ansible

A configuração da máquina servidora é realizada pelo Ansible, executado na VM1.

Acesse a VM1:

```bash
vagrant ssh vm1
```

Dentro da VM1, crie uma cópia dos arquivos do Ansible:

```bash
mkdir -p ~/ansible
cp /vagrant_data/ansible/* ~/ansible/
cd ~/ansible
```

Teste a comunicação com a VM2:

```bash
ansible servidores -m ping
```

Verifique a sintaxe do playbook:

```bash
ansible-playbook configura-node.yaml --syntax-check
```

Execute o playbook para instalar e configurar a aplicação:

```bash
ansible-playbook configura-node.yaml
```

Verifique o serviço da aplicação:

```bash
ansible servidores -m command -a "systemctl status eventos-e-ingressos --no-pager"
```

### Testar a comunicação entre as máquinas

Após iniciar as máquinas, acesse a VM1:

```bash
vagrant ssh vm1
```

Dentro da VM1, execute:

```bash
curl -i http://192.168.56.11:8080/eventos
```

**Resultado esperado:** resposta HTTP `200 OK` e retorno `[]` quando não houver eventos cadastrados.

### Parar e reiniciar as máquinas

Para desligar as máquinas:

```bash
vagrant halt
```

Para iniciar novamente:

```bash
vagrant up --provider=virtualbox
```

Para executar novamente a configuração da VM2 pelo Ansible, acesse a VM1:

```bash
vagrant ssh vm1
```

Dentro da VM1, atualize os arquivos do Ansible e execute o playbook:

```bash
cp /vagrant_data/ansible/* ~/ansible/
cd ~/ansible
ansible-playbook configura-node.yaml
```

Para remover as máquinas virtuais:

```bash
vagrant destroy
```

### Validação final

Em 06/11/2026, foi realizada a validação da infraestrutura com sucesso.

- VM1 e VM2 em execução.
- Comunicação entre as máquinas confirmada.
- Teste da rota `GET /eventos` realizado a partir da VM1.
- Resultado: HTTP 200 OK.
- Corpo da resposta: `[]`.

## Integração Contínua (CI)

O repositório possui três workflows de GitHub Actions, localizados em `.github/workflows/`:

- `commit.yml` — executado a cada push em qualquer branch.
- `pull-request.yml` — executado quando uma Pull Request tem a `main` como destino.
- `sonarqube.yml` — executado em pushes na `main` e em Pull Requests direcionadas à `main`, realizando a análise com SonarQube.

Os workflows realizam testes, verificação de cobertura, análise com ESLint e análise de qualidade com SonarQube, conforme suas configurações.

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