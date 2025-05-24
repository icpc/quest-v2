FROM alpine:3 as downloader

ARG TARGETOS
ARG TARGETARCH
ARG POCKETBASE_VERSION

ENV BUILDX_ARCH="${TARGETOS:-linux}_${TARGETARCH:-amd64}"

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_${BUILDX_ARCH}.zip \
    && unzip pocketbase_${POCKETBASE_VERSION}_${BUILDX_ARCH}.zip \
    && chmod +x /pocketbase

FROM node:23-alpine as builder

RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM alpine:3
RUN apk update && apk add ca-certificates && rm -rf /var/cache/apk/*

EXPOSE 8090

COPY --from=downloader /pocketbase /usr/local/bin/pocketbase
COPY --from=builder /app/build /pb_public
COPY pb_hooks /pb_hooks
COPY pb_migrations /pb_migrations
ENTRYPOINT ["/usr/local/bin/pocketbase", "serve", "--dir=/pb_data", "--publicDir=/pb_public", "--hooksDir=/pb_hooks", "--migrationsDir=/pb_migrations"]