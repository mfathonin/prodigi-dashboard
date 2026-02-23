#!/bin/bash
set -euo pipefail
cp .env.dev.local .env.local
echo "Synced .env.dev.local -> .env.local"
