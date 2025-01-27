#!/usr/bin/env bash

clear

DOCKER_CONFIG_LOCATION=/etc/docker
REPLACE_PODMAN_CONFIRMATION='n'
QUICK_ROOT_PATH="$HOME/.dockeroot"

# Prompt to detect and replace podman
if command -v "podman" > /dev/null 2>&1; then
    read -n1 -rep "Podman exist in the system, continue and replace ? (y/n) " REPLACE_PODMAN_CONFIRMATION
fi

# Confirmation to change the root directory
read -n1 -rep "Would you like to change docker root path ? (y/n) " PATH_CONFIRMATION
if [[ ! "$PATH_CONFIRMATION" =~ [Nn] ]]; then
    echo "Quick path: $QUICK_ROOT_PATH"
    read -rp "Enter your Docker root path (Leave it empty to use quick path): " ROOT_PATH

    if [[ -z "$ROOT_PATH" ]]; then
        ROOT_PATH="$QUICK_ROOT_PATH"
    fi

    if [[ ! -d "$ROOT_PATH" ]] && [[ "$ROOT_PATH" != "$QUICK_ROOT_PATH" ]]; then
        read -n1 -rep "Directory doesn't exit, would you like to create the directory ? (y/n) " PATH_CREATION_CONFIRMATION
    else
        PATH_CREATION_CONFIRMATION='y'
    fi
fi

# Uninstall podman
if [[ ! "$REPLACE_PODMAN_CONFIRMATION" =~ [Nn] ]]; then
    sudo pacman -Rsc --noconfirm podman podman-compose buildah
    rm -rf "$HOME/.config/containers"
fi

# Configuring Docker root path
if [[ ! "$PATH_CONFIRMATION" =~ [Nn] ]]; then
    sudo rm -rf $DOCKER_CONFIG_LOCATION
    sudo mkdir -p $DOCKER_CONFIG_LOCATION

    echo -e "{\n\"data-root\": \"$ROOT_PATH\"\n}" | sudo tee $DOCKER_CONFIG_LOCATION/daemon.json

    if [[ ! "$PATH_CREATION_CONFIRMATION" =~ [Nn] ]] && [[ ! -d $ROOT_PATH ]]; then
        echo -e "Create directory for docker\n"
        mkdir -p "$ROOT_PATH"
    fi
fi

# Main installation
sudo pacman -S --noconfirm docker iptables-nft docker-compose docker-buildx
getent group docker || sudo groupadd docker
sudo usermod -aG docker "$USER"
sudo systemctl enable docker --now || true

echo -e
echo "Installation might require reboot"
