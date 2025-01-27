#!/usr/bin/env bash

clear

sudo pacman -S --noconfirm gimp

curl -s https://api.github.com/repos/Diolinux/PhotoGIMP/releases/latest |
grep -o '"browser_download_url": *"[^"]*"' |
cut -d '"' -f 4 |
xargs wget -O "$HOME/photogimp.zip"

unzip -o "$HOME/photogimp.zip" -d "$HOME"
cp -r "$HOME/PhotoGIMP-master/.var/app/org.gimp.GIMP/config/GIMP" "$HOME/.config"

rm -rf "$HOME"/PhotoGIMP-master*
rm -rf "$HOME"/photogimp.zip

clear
echo "Gimp installed"
