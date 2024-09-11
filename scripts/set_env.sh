#!/bin/bash
set -a
source "${ENV_FILE:-.env.local}"
set +a

while IFS='=' read -r key value
do
  if [[ ! $key =~ ^# && -n $key ]]; then
    export "$key=$value"
  fi
done < "${ENV_FILE:-.env.local}"