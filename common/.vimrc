filetype on
filetype indent on
syntax on

set shell=zsh

colorscheme retrobox
set background=dark
set cursorline
set guicursor=
set nolist
set fillchars=eob:\ 

set number
set relativenumber

set tabstop=4
set shiftwidth=4
set softtabstop=4
set expandtab
set smarttab
set smartindent

set nowrap
set scrolloff=8

set splitright
set splitbelow

set ignorecase
set smartcase

set iskeyword+=-
set isfname+=@-@

set clipboard+=unnamedplus
set nohlsearch
set incsearch

set noswapfile
set nobackup

set updatetime=50
set autoread
set signcolumn=yes
set laststatus=2

" ---- Keybind
let mapleader = " "

vnoremap <silent> J :m '>+1<CR>gv=gv
vnoremap <silent> K :m '<-2<CR>gv=gv

nnoremap <silent> x "_x
xnoremap <silent> x "_x
vnoremap <silent> x "_x

nnoremap <silent> <C-d> <C-d>zz
nnoremap <silent> <C-u> <C-u>zz

nnoremap <silent> J mzJ`z

nnoremap <silent> n nzzzv
nnoremap <silent> N Nzzzv

nnoremap <silent> <C-k> :cnext<CR>zz
nnoremap <silent> <C-j> :cprev<CR>zz

nnoremap <silent> <leader>k :lnext<CR>zz
nnoremap <silent> <leader>j :lprev<CR>zz

vnoremap <silent> <leader>p "_dP

nnoremap <silent> <leader>y "+y
vnoremap <silent> <leader>y "+y

nnoremap <silent> <leader>d "_d
vnoremap <silent> <leader>d "_d

nnoremap <silent> <leader>S :%s/\<<C-r><C-w>\>/<C-r><C-w>/gI<Left><Left><Left>

nnoremap <silent> <leader>x :!chmod +x %<CR>

nnoremap <silent> <leader><leader> :so $MYVIMRC<CR>
nnoremap <silent> <leader>pv :Ex<cr>
