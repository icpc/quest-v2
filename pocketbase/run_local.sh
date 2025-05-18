#!/bin/bash
set -e

mkdir -p ./pb_data ./pb_public ./pb_hooks ./pb_migrations

pocketbase serve \
  --dev \
  --dir=./pb_data \
  --publicDir=./pb_public \
  --hooksDir=./pb_hooks \
  --migrationsDir=./pb_migrations 
