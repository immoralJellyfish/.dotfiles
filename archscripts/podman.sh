#!/usr/bin/env bash

source "./lib/utils.sh"

clear
print_color $YELLOW "Installation require to reboot, proceed (y/n) "
read -n1 -rep "" PRCD

DOC_REP='n'
if package_exist "docker"; then
    print_color $CYAN "Docker exist in the system, replace? (y/n)"
    read -n1 -rep '' DOC_REP
fi

print_color $CYAN "Would you like to change podman root path (y/n) "
read -n1 -rep '' PODPTH

if [[ ! "$PODPTH" =~ [Nn] ]]; then
    QUICKPATH_POD="$HOME/.podmanroot"

    print_color $GREEN "Quick path: "
    print_color $WHITE "$QUICKPATH_POD"
    echo -e
    read -p "Enter your Podman root path (Leave it empty to use quick path): " PATH_POD

    if [[ -z "$PATH_POD" ]]; then
        PATH_POD="$QUICKPATH_POD"
    fi
fi

if [[ ! "$PODPTH" =~ [Nn] ]] && [[ ! -d "$PATH_POD" ]]; then
    print_color $CYAN "Path that you enter doesn't exist, would you like to create the folder? (y/n) "
    read -n1 -rep "" PODCM
fi

if [[ ! "$DOC_REP" =~ [Nn] ]]; then
    print_color $YELLOW "Removing Docker from the system\n"
    pman -Rsc --noconfirm docker docker-compose docker-buildx
    sudo rm -rf /etc/docker
fi

print_color $YELLOW "\nInstalling Podman...\n"
install podman podman-compose buildah fuse-overlayfs

if [[ ! "$PODPTH" =~ [Nn] ]]; then
    LOC_POD=$HOME/.config/containers

    rm -rf $LOC_POD
    mkdir -p $LOC_POD

    echo -e "[storage]" >$LOC_POD/storage.conf
    echo -e "driver = 'overlay'" >>$LOC_POD/storage.conf
    echo -e "graphroot = '$PATH_POD'" >>$LOC_POD/storage.conf

    if [[ ! "$PODCM" =~ [Nn] ]] && [[ ! -d $PATH_POD ]]; then
        echo -e "Create directory for podman\n"
        mkdir -p $PATH_POD
    fi
fi

echo 'unqualified-search-registries = ["docker.io"]' | sudo tee /etc/containers/registries.conf.d/10-unqualified-search-registries.conf

clear
print_color $GREEN "Podman installed\n"

if [[ ! "$PRCD" =~ [Nn] ]]; then
    sleep 1
    print_color $GREEN "Rebooting...\n"
    sleep 3
    sudo systemctl reboot
else
    print_color $YELLOW "In order to use podman without sudo reboot machine\n"
fi
