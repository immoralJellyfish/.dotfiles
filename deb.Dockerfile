FROM ubuntu:noble AS base

ENV DEBIAN_FRONTEND=noninteractive
ENV USER=john

RUN apt-get update -y \
    && apt-get install -y software-properties-common curl git \
    && apt-get update -y \
    && apt-get install -y sudo apt-utils

RUN groupadd --gid 1001 john \
    && useradd -m -s /bin/bash john -g john \
    && usermod -aG sudo john  \
    && echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

USER john

WORKDIR /home/john/.dotfiles

COPY . .
