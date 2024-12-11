#!/usr/bin/env bash

source "./lib/utils.sh"

print_color $YELLOW "\nInstall apps...\n"
sleep 2

PKG_LIST="obs-studio v4l2loopback-dkms"

install $PKG_LIST

clear
print_color $GREEN "$PKG_LIST installed\n"
