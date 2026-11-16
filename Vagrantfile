
Vagrant.configure("2") do |config|

  # Box base utilizada pelas duas maquinas
  config.vm.box = "ubuntu/jammy64"

  # Nao verificar atualizacoes automaticas da box
  config.vm.box_check_update = false


  # VM1 - NO DE CONTROLE DO ANSIBLE
  config.vm.define "vm1" do |vm1|

    vm1.vm.hostname = "eventos-vm1"

    # IPv4 privado da VM1
    vm1.vm.network "private_network",
      ip: "192.168.56.10",
      netmask: "255.255.255.0"

    # Configuracao do VirtualBox
    vm1.vm.provider "virtualbox" do |vb|
      vb.name = "eventos-e-ingressos-vm1"
      vb.gui = false
      vb.memory = 1024
      vb.cpus = 1
    end

    # Compartilha os arquivos do projeto com a VM1. Os arquivos do Ansible ficarao acessiveis em /vagrant_data
    vm1.vm.synced_folder ".", "/vagrant_data"

    #instala o Ansible e as ferramentas necessarias
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

      #ajustando as permissoes da chave privada e publica
      chown vagrant:vagrant /home/vagrant/.ssh/id_ed25519
      chown vagrant:vagrant /home/vagrant/.ssh/id_ed25519.pub
      chmod 600 /home/vagrant/.ssh/id_ed25519
      chmod 644 /home/vagrant/.ssh/id_ed25519.pub

      #disponibiliza a chave publica para a VM2
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

    #a instalação da aplicação será realizada pelo playbook Ansible na VM2.
    # O antigo script provision-vm2.sh nao será executado.

    # Configuracao do VirtualBox
    vm2.vm.provider "virtualbox" do |vb|
      vb.name = "eventos-e-ingressos-vm2"
      vb.gui = false
      vb.memory = 1024
      vb.cpus = 1
    end

  end

end
