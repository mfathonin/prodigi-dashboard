#!/bin/bash
unset $(grep -v '^#' "${ENV_FILE:-.env.local}" | sed 's/=.*//' | xargs)