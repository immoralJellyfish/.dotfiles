HISTFILE=~/.histfile
HISTSIZE=1000
SAVEHIST=1000

bindkey -e

autoload -Uz compinit
compinit

bindkey -s '^f' "sessionaizer\n"
bindkey -s '^n' "sessionaizer main\n"
