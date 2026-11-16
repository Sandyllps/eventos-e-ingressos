# Eventos e Ingressos

## Sobre o projeto

API REST desenvolvida para o gerenciamento de eventos e ingressos.

## Tecnologias utilizadas

**Desenvolvimento da aplicação:**
- Node.js
- JavaScript
- Express

**Infraestrutura e configuração:**
- Vagrant
- VirtualBox
- Ansible
- Datadog Agent

**Testes e qualidade:**
- Vitest + Supertest
- ESLint

**Conteinerização e integração contínua:**
- Docker
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

O projeto utiliza Vagrant e VirtualBox para criar duas máquinas virtuais Ubuntu 22.04. A VM1 funciona como nó de controle do Ansible, enquanto a VM2 funciona como servidora da aplicação e do monitoramento.

### Função das ferramentas

| Ferramenta | Função | Onde é executada |
|---|---|---|
| Vagrant | Cria e gerencia as máquinas virtuais. | No computador do usuário, pelo PowerShell. |
| Ansible | Configura e instala a aplicação na VM2. | Na VM1, acessando a VM2 por SSH. |
| Datadog Agent | Coleta e envia métricas da VM2 para a plataforma Datadog. | Na VM2, como serviço em execução. |

A plataforma Datadog é acessada pelo navegador do computador do usuário.

### Pré-requisitos

Antes de iniciar, é necessário instalar:

- Oracle VirtualBox
- HashiCorp Vagrant
- Git

Também é necessário baixar o repositório do projeto para o computador.

### Máquinas virtuais

| Máquina | Função | Endereço IP | Memória |
|---|---|---|---|
| VM1 | Nó de controle do Ansible | 192.168.56.10 | 1024 MB |
| VM2 | Servidora da aplicação e do monitoramento | 192.168.56.11 | 1024 MB |

As duas máquinas utilizam o provedor VirtualBox.

A pasta do projeto é compartilhada com as duas máquinas no diretório `/vagrant_data`.

### Iniciar as máquinas

Na pasta principal do projeto, execute primeiro:

```bash
vagrant up vm1 --provider=virtualbox
```

A VM1 será criada e configurada. Durante essa etapa, o Ansible será instalado e uma chave SSH será gerada para permitir o acesso à VM2.

Antes de iniciar a VM2 pela primeira vez, configure a API Key do Datadog, conforme explicado na seção [Monitoramento com Datadog](#monitoramento-com-datadog).

Em seguida, execute:

```bash
vagrant up vm2 --provider=virtualbox
```

A VM2 será criada e configurada para autorizar a chave pública gerada pela VM1 e instalar automaticamente o Datadog Agent.

A inicialização deve ocorrer nessa ordem porque a VM2 precisa encontrar a chave pública criada pela VM1.

Para verificar o estado das máquinas:

```bash
vagrant status
```

### Acessar as máquinas

Para acessar a máquina controladora:

```bash
vagrant ssh vm1
```

Para acessar a máquina servidora:

```bash
vagrant ssh vm2
```

Para sair de uma máquina virtual, execute:

```bash
exit
```

### Configurar a VM2 com Ansible

A configuração da aplicação na VM2 é realizada pelo Ansible, executado dentro da VM1.

Primeiro, acesse a VM1:

```bash
vagrant ssh vm1
```

Dentro da VM1, crie uma pasta para armazenar os arquivos de configuração do Ansible:

```bash
mkdir -p ~/ansible
```

Copie os arquivos necessários da pasta compartilhada:

```bash
cp /vagrant_data/ansible/ansible.cfg ~/ansible/
cp /vagrant_data/ansible/inventory.ini ~/ansible/
cp /vagrant_data/ansible/configura-node.yaml ~/ansible/
```

Acesse a pasta:

```bash
cd ~/ansible
```

Teste a comunicação entre a VM1 e a VM2:

```bash
ansible servidores -m ping
```

O resultado esperado é uma resposta `SUCCESS` com `ping: pong`, indicando que a VM1 consegue acessar a VM2 e executar tarefas remotamente.

Verifique a sintaxe do playbook:

```bash
ansible-playbook configura-node.yaml --syntax-check
```

Execute o playbook para instalar e configurar a aplicação na VM2:

```bash
ansible-playbook configura-node.yaml
```

O playbook realiza as seguintes tarefas:

- Atualiza a lista de pacotes da VM2.
- Instala o Git e as dependências necessárias.
- Instala o Node.js e o npm.
- Clona o repositório da aplicação na VM2.
- Instala as dependências da aplicação.
- Configura o serviço `eventos-e-ingressos`.
- Habilita e inicia o serviço da aplicação.

Para verificar o estado do serviço:

```bash
ansible servidores -m command -a "systemctl status eventos-e-ingressos --no-pager"
```

O serviço deve apresentar o estado `active (running)`.

### Testar a rota GET /eventos

Após a execução bem-sucedida do playbook, a aplicação estará em execução na VM2.

Para realizar o teste exigido, acesse a VM1:

```bash
vagrant ssh vm1
```

Dentro da VM1, execute:

```bash
curl -i http://192.168.56.11:8080/eventos
```

**Resultado esperado:** resposta HTTP `200 OK` e retorno `[]` quando não houver eventos cadastrados.

O teste é realizado a partir da VM1, utilizando a ferramenta curl para acessar a rota da aplicação executada na VM2.

## Monitoramento com Datadog

O projeto utiliza o Datadog Agent para monitorar os recursos da VM2 e enviar métricas para a plataforma Datadog.

### Configurar a API Key

Antes de iniciar a VM2 pela primeira vez, é necessário criar uma API Key na plataforma Datadog.

1. Acesse [Datadog](https://app.datadoghq.com/), entre na sua conta ou crie uma caso não possua.
2. Abra **Organization Settings**.
3. Acesse **API Keys**, na seção Access.
4. Clique em **New Key**.
5. No campo de nome, informe um nome para identificar a chave.

   Como sugestão, utilize `eventos-e-ingressos-vm2`. Esse nome é apenas uma identificação dentro da plataforma e pode ser substituído por outro de sua preferência.

6. Clique em **Create API Key**.
7. Copie o valor da API Key criada.

Neste projeto, foi utilizada a região US1, identificada pelo endereço `datadoghq.com`.

**Atenção:** não confunda API Key com Key ID. O Agent precisa do valor da API Key para autenticar o envio das métricas. A chave não deve ser incluída no `Vagrantfile` nem em arquivos versionados no GitHub.

Cada pessoa que executar o projeto poderá utilizar uma API Key da organização Datadog à qual tenha acesso.

### Disponibilizar a API Key no PowerShell

No PowerShell do Windows, dentro da pasta principal do projeto, execute:

```powershell
$env:DD_API_KEY = (Read-Host "Cole a API Key do Datadog").Trim()
```

Quando solicitado, cole o valor da API Key e pressione Enter. Caso o atalho Ctrl + V não funcione, utilize Shift + Insert.

Para verificar se a chave foi carregada corretamente, sem exibir seu conteúdo, execute:

```powershell
if ($env:DD_API_KEY -match '^[a-fA-F0-9]{32}$') {
    Write-Host "API Key carregada corretamente."
}
else {
    Write-Host "ERRO: API Key ausente ou em formato invalido."
}
```

A variável fica disponível na sessão atual do PowerShell. Se a janela for fechada, será necessário informar a chave novamente antes de executar um novo provisionamento que dependa dela.

### Instalação automática do Datadog Agent

Após carregar a API Key, execute:

```powershell
vagrant up vm1 --provider=virtualbox
```

Depois:

```powershell
vagrant up vm2 --provider=virtualbox
```

Durante a criação da VM2, o provisionamento do Vagrant:

- Verifica se a API Key foi informada.
- Instala o Datadog Agent 7.
- Configura a API Key e a região US1.
- Habilita e inicia o serviço `datadog-agent`.

A instalação é realizada automaticamente pelo Vagrant. Não é necessário executar o instalador manualmente dentro da VM2.

Caso a VM2 já exista e seja necessário executar novamente o provisionamento, informe a API Key no PowerShell e execute:

```powershell
vagrant provision vm2
```

### Verificar o funcionamento do Agent

Para verificar se o serviço está ativo:

```powershell
vagrant ssh vm2 -c "sudo systemctl is-active datadog-agent"
```

O resultado esperado é:

```text
active
```

Para consultar o estado detalhado do Agent:

```powershell
vagrant ssh vm2 -c "sudo datadog-agent status"
```

O relatório apresenta informações sobre a versão do Agent, o nome da máquina, a validade da API Key e o funcionamento dos componentes de coleta e envio de métricas.

### Visualizar o monitoramento no Datadog

Acesse a plataforma [Datadog](https://app.datadoghq.com/).

Entre em **Infrastructure → Hosts**, localize `eventos-vm2` e abra o painel de monitoramento.

O painel apresenta gráficos de:

- CPU usage (%).
- Processes memory usage.
- Load Averages 1-5-15.
- Memory breakdown.
- Available Swap.
- Disk usage by device (%).
- Disk latency (by device).
- Network traffic (bytes per sec).

Esses gráficos permitem acompanhar o uso do processador, da memória, do disco e da rede, além de outras informações da máquina.

### Parar e reiniciar as máquinas

Para desligar as duas máquinas:

```bash
vagrant halt
```

Para iniciá-las novamente, na pasta principal do projeto, execute:

```bash
vagrant up vm1 --provider=virtualbox
vagrant up vm2 --provider=virtualbox
```

Para executar novamente a configuração da VM2 pelo Ansible, acesse a VM1:

```bash
vagrant ssh vm1
```

Dentro da VM1, atualize os arquivos de configuração:

```bash
cp /vagrant_data/ansible/ansible.cfg ~/ansible/
cp /vagrant_data/ansible/inventory.ini ~/ansible/
cp /vagrant_data/ansible/configura-node.yaml ~/ansible/
```

Acesse a pasta e execute novamente o playbook:

```bash
cd ~/ansible
ansible-playbook configura-node.yaml
```

Para remover as máquinas virtuais:

```bash
vagrant destroy
```

**Atenção:** esse comando remove as máquinas virtuais do computador. Para utilizá-las novamente, será necessário criá-las outra vez com os comandos de inicialização apresentados anteriormente. Também será necessário informar novamente a API Key antes de criar a VM2.

### Validação da infraestrutura

Em 16/11/2026, foi realizada a validação da infraestrutura no ambiente local, com os seguintes resultados:

- VM1 e VM2 criadas e iniciadas pelo Vagrant utilizando o VirtualBox.
- VM1 configurada com 1024 MB de memória e endereço IP privado `192.168.56.10`.
- VM2 configurada com 1024 MB de memória e endereço IP privado `192.168.56.11`.
- Pasta do projeto compartilhada nas duas máquinas em `/vagrant_data`.
- Ansible instalado e executando na VM1.
- Chaves SSH geradas e acesso entre VM1 e VM2 confirmado.
- Teste de comunicação Ansible realizado com sucesso, retornando `pong`.
- Sintaxe do playbook `configura-node.yaml` verificada sem erros.
- Playbook executado com sucesso, sem tarefas com falha.
- Node.js e dependências da aplicação instalados na VM2.
- Serviço `eventos-e-ingressos` ativo e em execução.
- Teste da rota `GET /eventos` realizado a partir da VM1, com resposta HTTP `200 OK`.
- Datadog Agent instalado automaticamente durante a criação de uma nova VM2.
- Serviço `datadog-agent` ativo e habilitado.
- API Key validada e conexão com a organização Datadog autorizada.
- VM2 identificada como `eventos-vm2` na lista de hosts monitorados.
- Envios de métricas confirmados pelo Forwarder do Agent.
- Gráficos de CPU, memória, carga, swap, disco e rede apresentando dados no painel do host.

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