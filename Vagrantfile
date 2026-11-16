Vagrant.configure("2") do |config|

  # Box base utilizada pelas duas máquinas
  config.vm.box = "ubuntu/jammy64"

  # Não verificar atualizações automáticas da box
  config.vm.box_check_update = false

  # VM1 - NO DE CONTROLE DO ANSIBLE
  config.vm.define "vm1" do |vm1|

    vm1.vm.hostname = "eventos-vm1"

    # IPv4 privado da VM1
    vm1.vm.network "private_network",
      ip: "192.168.56.10",
      netmask: "255.255.255.0"

    # Configuração do VirtualBox
    vm1.vm.provider "virtualbox" do |vb|
      vb.name = "eventos-e-ingressos-vm1"
      vb.gui = false
      vb.memory = 1024
      vb.cpus = 1
    end

    # Compartilha os arquivos do projeto com a VM1. Os arquivos do Ansible ficarão acessíveis em /vagrant_data
    vm1.vm.synced_folder ".", "/vagrant_data"

    #instala o Ansible e as ferramentas necessárias
    vm1.vm.provision "shell", inline: <<-SHELL
      set -e

      export DEBIAN_FRONTEND=noninteractive

      apt-get update

      apt-get install -y ansible curl wget iputils-ping openssh-client

      #cria a pasta de chaves SSH da VM1
      install -d -m 700 -o vagrant -g vagrant /home/vagrant/.ssh

      #gera uma chave SSH para a VM1 acessar a VM2
      if [ ! -f /home/vagrant/.ssh/id_ed25519 ]; then
        ssh-keygen -q -t ed25519 -N "" -f /home/vagrant/.ssh/id_ed25519
      fi

      #ajustando as permissões da chave privada e pública
      chown vagrant:vagrant /home/vagrant/.ssh/id_ed25519
      chown vagrant:vagrant /home/vagrant/.ssh/id_ed25519.pub
      chmod 600 /home/vagrant/.ssh/id_ed25519
      chmod 644 /home/vagrant/.ssh/id_ed25519.pub

      #disponibiliza a chave pública para a VM2
      cp /home/vagrant/.ssh/id_ed25519.pub /vagrant_data/ansible/vm1_ansible.pub
      chmod 644 /vagrant_data/ansible/vm1_ansible.pub
    SHELL

  end


  # VM2 - NO GERENCIADO / SERVIDOR
  config.vm.define "vm2" do |vm2|

    vm2.vm.hostname = "eventos-vm2"

    # IPv4 privado da VM2
    vm2.vm.network "private_network",
      ip: "192.168.56.11",
      netmask: "255.255.255.0"

    #compartilha os arquivos do projeto com a VM2
    vm2.vm.synced_folder ".", "/vagrant_data"

    #autoriza a chave SSH da VM1
    vm2.vm.provision "shell", inline: <<-SHELL
      set -e

      PUB_KEY="/vagrant_data/ansible/vm1_ansible.pub"

      #verifica se a chave pública foi criada pela VM1
      if [ ! -f "$PUB_KEY" ]; then
        echo "ERRO: chave publica da VM1 nao encontrada."
        exit 1
      fi

      #prepara a pasta SSH do usuário vagrant
      install -d -m 700 -o vagrant -g vagrant /home/vagrant/.ssh

      touch /home/vagrant/.ssh/authorized_keys

      #adiciona a chave pública se ela ainda não estiver autorizada
      PUB_KEY_CONTENT="$(cat "$PUB_KEY")"

      if ! grep -qxF "$PUB_KEY_CONTENT" /home/vagrant/.ssh/authorized_keys; then
        printf '%s\n' "$PUB_KEY_CONTENT" >> /home/vagrant/.ssh/authorized_keys
      fi

      #ajusta as permissões
      chown vagrant:vagrant /home/vagrant/.ssh/authorized_keys
      chmod 600 /home/vagrant/.ssh/authorized_keys
    SHELL

    #a instalação da aplicação será realizada pelo playbook Ansible na VM2
    # O antigo script provision-vm2.sh não será executado

    #instala o Datadog agent na VM2
    vm2.vm.provision "shell",
      name: "Instala Datadog Agent",
      env: {
        "DD_API_KEY" => ENV["DD_API_KEY"] || "",
        "DD_SITE" => "datadoghq.com"
      },
      sensitive: true,
      inline: <<-'SHELL'
        set -e

        #verifica se a API Key foi informada
        if ! printf '%s' "$DD_API_KEY" | grep -Eq '^[a-fA-F0-9]{32}$'; then
          echo "ERRO: API Key ausente ou invalida."
          exit 1
        fi

        export DEBIAN_FRONTEND=noninteractive

        #instala o curl, necessário para baixar o instalador
        apt-get update
        apt-get install -y curl

        #instala o agent somente se ainda não estiver instalado
        if ! command -v datadog-agent >/dev/null 2>&1; then
          DD_API_KEY="$DD_API_KEY" DD_SITE="$DD_SITE" bash -c "$(curl -fsSL https://install.datadoghq.com/scripts/install_script_agent7.sh)"
        fi

        #atualiza a API Key e a região na configuração do agent
        printf 'api_key: "%s"\nsite: "%s"\n' "$DD_API_KEY" "$DD_SITE" > /etc/datadog-agent/datadog.yaml

        #habilita e inicia o serviço
        systemctl enable datadog-agent
        systemctl restart datadog-agent
      SHELL

    #configuração do VirtualBox
    vm2.vm.provider "virtualbox" do |vb|
      vb.name = "eventos-e-ingressos-vm2"
      vb.gui = false
      vb.memory = 1024
      vb.cpus = 1
    end

  end

end