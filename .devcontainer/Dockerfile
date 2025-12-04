ARG NODE_VERSION=22
ARG POCKETBASE_VERSION=0.28.4

FROM mcr.microsoft.com/devcontainers/typescript-node:${NODE_VERSION}

RUN apt-get update \
  && apt-get install -y --no-install-recommends wget unzip ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN set -euo pipefail; \
  PB_VERSION="${POCKETBASE_VERSION:-0.28.4}"; \
  if [ -z "${PB_VERSION}" ]; then echo "POCKETBASE_VERSION build arg is required" >&2; exit 1; fi; \
  ARCH="$(uname -m)"; \
  case "${ARCH}" in \
  x86_64) PB_ARCH="amd64" ;; \
  aarch64|arm64) PB_ARCH="arm64" ;; \
  *) echo "Unsupported architecture: ${ARCH}" && exit 1 ;; \
  esac; \
  PB_ZIP="pocketbase_${PB_VERSION}_linux_${PB_ARCH}.zip"; \
  PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/${PB_ZIP}"; \
  wget -q "${PB_URL}" -O "/tmp/${PB_ZIP}"; \
  unzip "/tmp/${PB_ZIP}" -d /usr/local/bin; \
  rm "/tmp/${PB_ZIP}"; \
  chmod +x /usr/local/bin/pocketbase

RUN corepack enable
