#!/usr/bin/env bash

source "./lib/utils.sh"

QEMU_PACKAGE="qemu-full libvirt virt-manager virt-viewer dnsmasq bridge-utils dmidecode swtpm openbsd-netcat iptables-nft libguestfs"

# Path to the libvirtd.conf file
function remove_path() {
    local path="$1"
    local path_cl="$2"

    if [ -L "$path" ]; then
        echo "Unlinking symlink: $path"
        sudo unlink "$path"
    elif [ -d "$path" ]; then
        echo "Removing directory: $path"
        sudo cp -r "$path/." $path_cl
        sudo rm -rf "$path"
    else
        echo "Path is neither a symlink nor a directory: $path"
    fi
}

clear
print_color $YELLOW "Installation require to reboot, proceed (y/n) "
read -n1 -rep "" PRCD

print_color $CYAN "would you like to change qemu storage path (y/n) "
read -n1 -rep '' QMPTH

if [[ ! "$QMPTH" =~ [Nn] ]]; then
    QUICKPATH_QM="$HOME/VMStorage"

    print_color $GREEN "Quick path: "
    print_color $WHITE "$QUICKPATH_QM"
    echo -e
    read -p "Enter your Podman root path (Leave it empty to use quick path): " ROOT_QM

    if [[ -z "$ROOT_QM" ]]; then
        ROOT_QM="$QUICKPATH_QM"
    fi
fi

if [[ ! "$QMPTH" =~ [Nn] ]] && [[ ! -d "$ROOT_QM" ]]; then
    print_color $CYAN "Path that you enter doesn't exist, would you like to create the folder? (y/n) "
    read -n1 -rep "" QMCM
fi

print_color $YELLOW "\nInstalling Qemu virtual machine...\n"

if [[ ! "$QMPTH" =~ [Nn] ]]; then
    if [[ ! "$QMCM" =~ [Nn] ]] && [[ ! -d $ROOT_QM ]]; then
        echo -e "Create directory for Qemu Virt Manager\n"
        mkdir -p $ROOT_QM
    fi

    if [[ ! -d $ROOT_QM/_config ]]; then
        mkdir -p $ROOT_QM/_config
    fi

    if [[ ! -d $ROOT_QM/_data ]]; then
        mkdir -p $ROOT_QM/_data
    fi

    pman -Rd --nodeps --noconfirm iptables || true
    install $QEMU_PACKAGE

    # remove_path "/var/lib/libvirt/images" "$ROOT_QM/disks"
    remove_path "/etc/libvirt/qemu" "$ROOT_QM/_config"
    remove_path "/var/lib/libvirt/qemu" "$ROOT_QM/_data"
    remove_path "/var/lib/libvirt/images" "$ROOT_QM"

    # sudo ln -sf $ROOT_QM/disks /var/lib/libvirt/images
    sudo ln -sf $ROOT_QM/_config /etc/libvirt/qemu
    sudo ln -sf $ROOT_QM/_data /var/lib/libvirt/qemu
    sudo ln -sf $ROOT_QM /var/lib/libvirt/images
else
    pman -Rd --nodeps --noconfirm iptables || true
    install $QEMU_PACKAGE
fi

echo "options kvm_intel nested=1" | sudo tee /etc/modprobe.d/kvm.conf
echo "options kvm_intel emulate_invalid_guest_state=0" | sudo tee -a /etc/modprobe.d/kvm.conf
echo "options kvm ignore_msrs=1 report_ignored_msrs=0" | sudo tee -a /etc/modprobe.d/kvm.conf

sudo sed -i -e 's/#unix_sock_group = "libvirt"/unix_sock_group = "libvirt"/' \
    -e 's/#unix_sock_rw_perms = "0770"/unix_sock_rw_perms = "0770"/' /etc/libvirt/libvirtd.conf

sudo usermod -aG libvirt $USER
sudo usermod -aG libvirt-qemu $USER
sudo usermod -aG kvm $USER
sudo usermod -aG input $USER
sudo usermod -aG disk $USER

dconf write /org/virt-manager/virt-manager/xmleditor-enabled true
dconf write /org/virt-manager/virt-manager/console/resize-guest 1
dconf write /org/virt-manager/virt-manager/console/scaling 2
dconf write /org/virt-manager/virt-manager/console/auto-redirect false
dconf write /org/virt-manager/virt-manager/system-tray true

sudo systemctl enable --now libvirtd

if sudo virsh net-info default >/dev/null 2>&1; then
    echo -e
    print_color $GREEN "Network 'default' is already defined.\n"

    if [[ -z "$(sudo virsh net-info default | grep -E "Active:\s+yes")" ]]; then
        print_color $YELLOW "Network 'default' is not started. Starting it now...\n"
        sudo virsh net-start default || true
    fi

    if [[ -z "$(sudo virsh net-info default | grep -E "Autostart:\s+yes")" ]]; then
        print_color $YELLOW "Network 'default' is not set to autostart. Configuring it now...\n"
        sudo virsh net-autostart default || true
    fi
else
    print_color $YELLOW "Network 'default' is not defined. Defining it now..."
    sudo virsh net-define --file ./.config/default.xml
    sudo virsh net-start default || true
    sudo virsh net-autostart default || true
    print_color $GREEN "Network 'default' has been defined, started, and set to autostart.\n"
fi

clear
print_color $GREEN "Qemu installed\n"
print_color $YELLOW "If something doesn't work, Reboot might be needed\n"

if [[ ! "$PRCD" =~ [Nn] ]]; then
    print_color $YELLOW "Rebooting...\n"
    sleep 3
    sudo systemctl reboot
fi
