# vim:ft=zsh

files=(
    main
    alias
    env
    path
    plugins
)

for file in "${files[@]}"; do
    source "$ZDOTDIR"/"$file".zsh
done
