#!/usr/bin/env bash

source "./lib/utils.sh"

print_color $YELLOW "\nInstalling...\n"
sleep 2

echo -e
install openbsd-netcat android-studio

JBR_PATH="export PATH=\"/opt/android-studio/jbr/bin:\$PATH\""
TOOLS_PATH="export PATH=\"\$ANDROID_HOME/tools:\$ANDROID_HOME/tools/bin:\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/emulator:\$PATH\""

if [[ -z $(grep -F "$JBR_PATH" $HOME/.zshrc) ]]; then
    echo -e "\n# Android studio" >>$HOME/.zshrc
    echo -e $JBR_PATH >>$HOME/.zshrc
fi

if [[ -z $(grep -F "$TOOLS_PATH" $HOME/.zshrc) ]]; then
    echo -e $TOOLS_PATH >>$HOME/.zshrc
fi

clear
print_color $GREEN "Android studio installed\n"
