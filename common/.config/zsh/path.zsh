export PATH="$PATH:$HOME/.local/bin"
export PATH="$PATH:$HOME/.scripts"

for dir in $HOME/.scripts/**/*; do
    PATH="$PATH:$dir"
done

#--------- StartNode ---------#
export N_PREFIX="/usr/local/node"
export N_CACHE_PREFIX="/home/akbarsanihasan/.cache"
export PATH="$PATH:$N_PREFIX/bin"
export PATH="$PATH:$N_PREFIX/npm/bin"
#--------- EndNode ---------#

#--------- StartGO ---------#
export GOROOT="/usr/local/go"
export GOPATH="/home/akbarsanihasan/.go"
export PATH="$PATH:$GOROOT/bin"
export PATH="$PATH:$GOPATH/bin"
#--------- EndGO ---------#

#--------- StartRust ---------#
export CARGO_HOME="/home/akbarsanihasan/.cargo"
export RUSTUP_HOME="/home/akbarsanihasan/.cache/rustup"
export PATH="$PATH:/home/akbarsanihasan/.cargo/bin"
#--------- EndRust ---------#

#--------- StartPHP ---------#
export COMPOSER_HOME=$HOME/.composer
export PATH=$COMPOSER_HOME/vendor/bin:$PATH
#--------- EndComPHP ---------#
