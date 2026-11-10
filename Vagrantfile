
Vagrant.configure("2") do |config|

  # Box base utilizada pelas duas maquinas
  config.vm.box = "ubuntu/jammy64"

  # Nao verificar atualizacoes automaticas da box
  config.vm.box_check_update = false

  # ==========================================
  # VM1 - NO DE CONTROLE DO ANSIBLE
  # ==========================================

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

    # Compartilha os arquivos do projeto com a VM1
    # Os arquivos do Ansible ficarao acessiveis em /vagrant_data
    vm1.vm.synced_folder ".", "/vagrant_data"

    # Instala o Ansible e as ferramentas necessarias
    vm1.vm.provision "shell", inline: <<-SHELL
      export DEBIAN_FRONTEND=noninteractive

      apt-get update

      apt-get install -y ansible curl wget iputils-ping openssh-client
    SHELL

  end

  # ==========================================
  # VM2 - NO GERENCIADO / SERVIDOR
  # ==========================================

  config.vm.define "vm2" do |vm2|

    vm2.vm.hostname = "eventos-vm2"

    # IPv4 privado da VM2
    vm2.vm.network "private_network",
      ip: "192.168.56.11",
      netmask: "255.255.255.0"

    # A instalacao da aplicacao sera realizada
    # pelo playbook Ansible na VM2.
    # O antigo script provision-vm2.sh nao sera executado.

    # Configuracao do VirtualBox
    vm2.vm.provider "virtualbox" do |vb|
      vb.name = "eventos-e-ingressos-vm2"
      vb.gui = false
      vb.memory = 1024
      vb.cpus = 1
    end

  end

end
