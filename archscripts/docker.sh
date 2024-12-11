#!/usr/bin/env bash

source "./lib/utils.sh"

POD_REP='n'
QUICKPATH_DOC="$HOME/.dockeroot"

clear
print_color $YELLOW "Installation require to reboot, proceed (y/n) "
read -n1 -rep "" PRCD

if package_exist "podman"; then
    print_color $CYAN "Podman exist in the system, replace? (y/n)"
    read -n1 -rep '' POD_REP
fi

print_color $CYAN "would you like to change docker root path (y/n) "
read -n1 -rep '' DCKPTH

if [[ ! "$DCKPTH" =~ [Nn] ]]; then
    print_color $GREEN "Quick path: "
    print_color $WHITE "$QUICKPATH_DOC"
    echo -e
    read -p "Enter your Docker root path (Leave it empty to use quick path): " ROOT_DOC

    if [[ -z "$ROOT_DOC" ]]; then
        ROOT_DOC="$QUICKPATH_DOC"
    fi
fi

if [[ ! "$DCKPTH" =~ [Nn] ]] && [[ ! -d "$ROOT_DOC" ]]; then
    print_color $CYAN "Path that you enter doesn't exist, would you like to create the folder? (y/n) "
    read -n1 -rep "" DKRCM
fi

if [[ ! "$POD_REP" =~ [Nn] ]]; then
    print_color $YELLOW "Removing podman from the system\n"
    pman -Rsc --noconfirm podman podman-compose buildah
    rm -rf $HOME/.config/containers
fi

print_color $YELLOW "\nInstalling Docker...\n"
install docker docker-compose docker-buildx

getent group docker || sudo groupadd docker
sudo usermod -aG docker $USER

if [[ ! "$DCKPTH" =~ [Nn] ]]; then
    LOC_DOC=/etc/docker

    sudo rm -rf $LOC_DOC

    sudo mkdir -p $LOC_DOC

    echo -e "{\n\"data-root\": \"$ROOT_DOC\"\n}" | sudo tee $LOC_DOC/daemon.json

    if [[ ! "$DKRCM" =~ [Nn] ]] && [[ ! -d $ROOT_DOC ]]; then
        echo -e "Create directory for docker\n"
        mkdir -p $ROOT_DOC
    fi
fi

sudo systemctl enable docker --now || true

clear
print_color $GREEN "Docker installed\n"

if [[ ! "$PRCD" =~ [Nn] ]]; then
    sleep 1
    print_color $GREEN "Rebooting...\n"
    sleep 3
    sudo systemctl reboot
else
    print_color $YELLOW "In order to use docker without sudo reboot machine\n"
fi
