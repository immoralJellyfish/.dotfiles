#!/usr/bin/env bash

set -e

# Color code
BLACK=30
RED=31
GREEN=32
YELLOW=33
BLUE=34
MAGENTA=35
CYAN=36
WHITE=37

function print_color() {
    local color="$1"
    local text="$2"
    local reset="\e[0m" # Reset color

    printf "\e[%sm%b$reset" "$color" "$text"
}

function package_exist() {
    package_name=$1

    # Use pacman to check if the package is installed
    if pacman -Qi "$package_name" &>/dev/null; then
        return 0
    else
        return 1
    fi
}

source "lib/pman.sh"
