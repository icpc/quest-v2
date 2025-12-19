# .devcontainer/Dockerfile

ARG NODE_VERSION=20
ARG POCKETBASE_VERSION=0.34.2

FROM node:${NODE_VERSION}-bullseye

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# --- system deps (sqlite for typegen, wget/unzip for PB) ---
RUN set -eux \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
       wget \
       unzip \
       ca-certificates \
       sqlite3 \
       libsqlite3-dev \
       ripgrep \
  && rm -rf /var/lib/apt/lists/*

# --- pnpm via corepack ---
RUN corepack enable pnpm

# --- bake PocketBase into the image, auto-detect arch ---
ARG POCKETBASE_VERSION
RUN set -eux \
  && arch="$(uname -m)" \
  && case "${arch}" in \
       x86_64)        pb_arch="amd64" ;; \
       aarch64|arm64) pb_arch="arm64" ;; \
       *) echo "Unsupported architecture: ${arch}" >&2; exit 1 ;; \
     esac \
  && pb_zip="pocketbase_${POCKETBASE_VERSION}_linux_${pb_arch}.zip" \
  && pb_url="https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/${pb_zip}" \
  && echo "Downloading ${pb_url}" \
  && wget -q "${pb_url}" -O /tmp/pocketbase.zip \
  && unzip -q /tmp/pocketbase.zip -d /usr/local/bin \
  && rm /tmp/pocketbase.zip \
  && chmod +x /usr/local/bin/pocketbase

WORKDIR /workspaces/quest-v2
