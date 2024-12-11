FROM archlinux AS base

ENV USER=johnbtw

RUN pacman -Sy \
    && pacman -Sy --noconfirm sudo

RUN groupadd --gid 1001 johnbtw \
    && useradd -m -s /bin/bash johnbtw -g johnbtw \
    && usermod -aG wheel johnbtw  \
    && echo '%wheel ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER johnbtw

WORKDIR /home/johnbtw/.dotfiles

COPY . .
