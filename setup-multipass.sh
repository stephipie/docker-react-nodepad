#! /bin/sh

multipass launch --name manager --cpus 1 --memory 1G --cloud-init cloud-init.yml
multipass launch --name worker1 --cpus 1 --memory 1G --cloud-init cloud-init.yml
multipass launch --name worker2 --cpus 1 --memory 1G --cloud-init cloud-init.yml
multipass launch --name worker3 --cpus 2 --memory 2G --cloud-init cloud-init.yml