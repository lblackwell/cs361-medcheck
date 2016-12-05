# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "bento/ubuntu-16.04"


  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network.
  # Bridged networks make the machine appear as another physical device on
  # your network.
  # config.vm.network "public_network"

  # Enable using ssh keys from the host inside of the vagrant guest
  config.ssh.forward_agent = true

  # Virtualbox configuration.
  config.vm.provider "virtualbox" do |vb|
    vb.customize ["modifyvm", :id, "--memory", 1024]

    vb.customize ["modifyvm", :id, "--cpus", 2]
    vb.customize ["modifyvm", :id, "--ioapic", "on"]

    # Ensure vagrant guest can resolve DNS using the hosts VPN connection.
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
  end

  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  #
  #sed -e 's/root\s\/var\/www\/html/root \/vagrant\/modules\/database_driven_php\/public/' /etc/nginx/site-available/default
   config.vm.provision "shell", inline: <<-SHELL
     apt-get update
     sudo apt-get install -y build-essential

     curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
     apt-get install -y nodejs-legacy
     apt-get install -y npm postgresql sqlite3 sqlite3-dev nginx vim

     su postgres -c 'createdb medcheck --owner=postgres'

     su postgres -c "psql -c \"ALTER USER postgres WITH PASSWORD 'password';\""

     npm install nodemon -g
   SHELL

  config.vm.network :forwarded_port, guest: 3000, host: 7000

  config.vm.synced_folder ".", "/vagrant", id: "vagrant-root"
end
