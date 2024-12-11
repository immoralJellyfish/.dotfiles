#------------------------------------------- Init -------------------------------------------#
HISTFILE=~/.histfile
HISTSIZE=1000
SAVEHIST=1000

bindkey -e

autoload -Uz compinit
compinit

#------------------------------------------- Aliases -------------------------------------------#
alias c="clear"
alias q="exit"
alias mtar='tar -zcvf' # mtar <archive_compress>
alias utar='tar -zxvf' # utar <archive_decompress> <file_list>
alias z='zip -r'       # z <archive_compress> <file_list>
alias uz='unzip'       # uz <archive_decompress> -d <dir>
alias sr='source ~/.zshrc'
alias ..="cd .."
alias mkdir="mkdir -p"
alias ls="eza --icons=auto"
alias l="ls -l"
alias la="ls -a"
alias lla="ls -la"
alias lt="ls --tree"
alias cat="bat --color always --plain --theme=Catppuccin-mocha"
alias grep='grep --color=auto'
alias mv='mv -v'
alias cp='cp -vr'
alias rm='trash-put -v'
alias pman='yay'

#------------------------------------------- VAR -------------------------------------------#
export FZF_DEFAULT_OPTS=" \
--color=bg+:#313244,bg:#1e1e2e,spinner:#f5e0dc,hl:#f38ba8 \
--color=fg:#cdd6f4,header:#f38ba8,info:#cba6f7,pointer:#f5e0dc \
--color=marker:#b4befe,fg+:#cdd6f4,prompt:#cba6f7,hl+:#f38ba8 \
--prompt '󰭎 ' --pointer ' λ' --layout=reverse --border top \
--multi"

export VISUAL="nvim"
export EDITOR="nvim"

export BROWSER="firefox"

export ELECTRON_TRASH="trash-cli code"

export GTK_IM_MODULE='fcitx'
export QT_IM_MODULES='wayland;fcitx;ibus'
export XMODIFIERS='@im=fcitx'

export XDG_CONFIG_HOME="$HOME/.config"
export XDG_CACHE_HOME="$HOME/.cache"
export XDG_DATA_HOME="$HOME/.local/share"
export XDG_STATE_HOME="$HOME/.local/state"

export XDG_DESKTOP_DIR="$HOME/Desktop"
export XDG_DOWNLOAD_DIR="$HOME/Downloads"
export XDG_TEMPLATES_DIR="$HOME/Templates"
export XDG_PUBLICSHARE_DIR="$HOME/Public"
export XDG_DOCUMENTS_DIR="$HOME/Documents"
export XDG_MUSIC_DIR="$HOME/Music"
export XDG_PICTURES_DIR="$HOME/Pictures"
export XDG_VIDEOS_DIR="$HOME/Videos"

bindkey -s '^f' "sessionaizer\n"
bindkey -s '^n' "sessionaizer main\n"
bindkey '^[v' vi-forward-blank-word
bindkey '^[b' vi-backward-blank-word

#------------------------------------------- Plugins -------------------------------------------#
ZINIT_HOME="${ZINIT_HOME:-${XDG_DATA_HOME:-${HOME}/.local/share}/zinit}"

if [[ ! -f ${ZINIT_HOME}/zinit.git/zinit.zsh ]]; then
    print -P "%F{14}▓▒░ Installing Flexible and fast ZSH plugin manager %F{13}(zinit)%f"
    command mkdir -p "${ZINIT_HOME}" && command chmod g-rwX "${ZINIT_HOME}"
    command git clone https://github.com/zdharma-continuum/zinit.git "${ZINIT_HOME}/zinit.git" && \
        print -P "%F{10}▓▒░ Installation successful.%f%b" || \
        print -P "%F{9}▓▒░ The clone has failed.%f%b"
fi

source "${ZINIT_HOME}/zinit.git/zinit.zsh"

autoload -Uz _zinit
(( ${+_comps} )) && _comps[zinit]=_zinit

zinit light-mode for \
    hlissner/zsh-autopair \
    Aloxaf/fzf-tab \
    atinit"ZINIT[COMPINIT_OPTS]=-C; zicompinit; zicdreplay" \
    zdharma-continuum/fast-syntax-highlighting \
    blockf \
    zsh-users/zsh-completions \
    atload"!_zsh_autosuggest_start" \
    zsh-users/zsh-autosuggestions

zinit ice as'command' from'gh-r' \
    atload'export STARSHIP_CONFIG=$XDG_CONFIG_HOME/starship/starship.toml; eval $(starship init zsh)' \
    atclone'./starship init zsh > init.zsh; ./starship completions zsh > _starship' \
    atpull'%atclone' src'init.zsh'
zinit light starship/starship

zstyle ':fzf-tab:*' fzf-flags --color=bg+:#313244,bg:#1e1e2e,spinner:#f5e0dc,hl:#f38ba8 \
    --color=fg:#cdd6f4,header:#f38ba8,info:#cba6f7,pointer:#f5e0dc \
    --color=marker:#b4befe,fg+:#cdd6f4,prompt:#cba6f7,hl+:#f38ba8 \
    --prompt '󰭎 ' --pointer ' λ' --layout=reverse --border top \
    --multi

#------------------------------------------- Path -------------------------------------------#
export PATH="$HOME/.bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
export PATH="$HOME/.scripts:$PATH"

for dir in $HOME/.scripts/**/*; do
    PATH="$dir:$PATH"
done

#--------- StartNode ---------#
export N_PREFIX="$HOME/.node"
export N_CACHE_PREFIX="$HOME/.node"
export PATH="$HOME/.node/n/bin:$PATH"
export PATH="$HOME/.node/bin:$PATH"
#--------- EndNode ---------#

#--------- StartGO ---------#
eval $(go env)
export PATH=$HOME/$GOTPATH/bin:$PATH
#--------- EndGO ---------#

#--------- StartRust ---------#
[[ -r "$HOME/.cargo/env" ]] && . "$HOME/.cargo/env" > /dev/null 2> /dev/null || true
#--------- EndRust ---------#
#
#--------- StartPHP ---------#
export COMPOSER_HOME=$HOME/.composer
export PATH=$COMPOSER_HOME/vendor/bin:$PATH
#--------- EndPHP ---------#

#--------- StartPHP ---------#
export COMPOSER_HOME=$HOME/.composer
export PATH=$COMPOSER_HOME/vendor/bin:$PATH
#--------- EndComPHP ---------#
