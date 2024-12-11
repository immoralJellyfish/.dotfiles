#!/usr/bin/env bash

# Global var
CURRENT_DIRECTORY=$(pwd)
AURH="yay" # Change me to yay or other compatible aur helper

if ! package_exist "$AURH"; then
    rm -rf $HOME/$AURH

    git clone https://aur.archlinux.org/$AURH.git $HOME/$AURH

    sudo pacman -Sy base-devel --noconfirm

    cd $HOME/$AURH
    makepkg -si --noconfirm

    cd $CURRENT_DIRECTORY
    rm -rf $HOME/$AURH
fi

function pman() {
    local manager=$(which $AURH)

    if [[ -z "$manager" ]]; then
        echo "$AURH not installed"
        exit 0
    fi

    $manager "$@"
}

function install() {
    pman -Sy --removemake --noconfirm --needed --sudoloop --cleanafter "$@"
}
