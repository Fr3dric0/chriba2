#!/bin/bash

printf "Installing angular cli\n\n"
npm install -g angular-cli

printf "\nInstalling server packages\n\n"
npm install

printf "\nInstalling angular packages\n\n"
npm install --prefix ./client

printf "\nPackages are installed, run \"npm run build or watch\" to start server"

