#!/usr/bin/env bash

source "./lib/utils.sh"

clear
print_color $YELLOW "Installation require to reboot, proceed (y/n) "
read -n1 -rep "" PRCD

print_color $CYAN "Main kernel[rolling release]? (y/n) "
read -n1 -rep "" KRNL

ADD_PACKAGE="virtualbox-host-modules-arch"

if [[ ! "$KRNL" =~ [Nn] ]]; then
    ADD_PACKAGE="virtualbox-host-dkms"
fi

install virtualbox

sudo usermod -aG vboxusers $USER

clear
print_color $GREEN "Virtualbox installed\n"
print_color $YELLOW "If something doesn't work, Reboot might be needed\n"

if [[ ! "$PRCD" =~ [Nn] ]]; then
    print_color $YELLOW "Rebooting...\n"
    sleep 3
    sudo systemctl reboot
fi
