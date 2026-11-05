
Vagrant.configure("2") do |config|

  # Box base utilizada pelas duas maquinas
  config.vm.box = "ubuntu/jammy64"

  # Nao verificar atualizacoes automaticas da box
  config.vm.box_check_update = false

  # ==========================================
  # VM1 - MAQUINA CLIENTE
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

    # Ferramentas para testar a API
    vm1.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y curl wget iputils-ping
    SHELL

  end

  # ==========================================
  # VM2 - MAQUINA SERVIDORA
  # ==========================================

  config.vm.define "vm2" do |vm2|

    vm2.vm.hostname = "eventos-vm2"

    # IPv4 privado da VM2
    vm2.vm.network "private_network",
      ip: "192.168.56.11",
      netmask: "255.255.255.0"

    # Compartilhamento da pasta do projeto
    vm2.vm.synced_folder ".", "/vagrant_data"

    # Configuracao do VirtualBox
    vm2.vm.provider "virtualbox" do |vb|
      vb.name = "eventos-e-ingressos-vm2"
      vb.gui = false
      vb.memory = 1024
      vb.cpus = 1
    end

  end

end
