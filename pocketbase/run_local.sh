#!/bin/bash
set -e

ENCRYPTION="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
PORT=8090

export ENCRYPTION
pocketbase serve \
  --http=0.0.0.0:$PORT \
  --dir=./pb_data \
  --publicDir=./pb_public \
  --hooksDir=./pb_hooks \
  --migrationsDir=./pb_migrations \
  --encryptionEnv ENCRYPTION
