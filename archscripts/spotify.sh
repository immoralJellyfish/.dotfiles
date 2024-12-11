#!/usr/bin/env bash

source "./lib/utils.sh"

clear
print_color $MAGENTA "Installing spotify with spicetify theme...\n"
install spotify spicetify-cli

sudo chmod a+wr /opt/spotify
sudo chmod a+wr /opt/spotify/Apps -R

rm -rf $HOME/spicetify-catppuccin || true
git clone https://github.com/catppuccin/spicetify $HOME/spicetify-catppuccin

if [[ ! -d ~/.config/spotify ]]; then
    mkdir -p ~/.config/spotify
    touch ~/.config/spotify/prefs
fi

sleep 3
rm -rf ~/.config/spicetify/Themes/catppuccin || true
cp -r ~/spicetify-catppuccin/catppuccin ~/.config/spicetify/Themes/
rm -rf $HOME/spicetify-catppuccin || true

spicetify config current_theme catppuccin || true
spicetify config color_scheme mocha || true
spicetify config inject_css 1 inject_theme_js 1 replace_colors 1 overwrite_assets 1 || true
spicetify backup apply || true
spicetify refresh || true

clear
print_color $GREEN "Spotify installed\n"
