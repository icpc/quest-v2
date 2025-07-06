FROM alpine:3 AS downloader

ARG TARGET_OS
ARG TARGET_ARCH
ARG POCKETBASE_VERSION

ENV BUILDX_ARCH="${TARGET_OS:-linux}_${TARGET_ARCH:-amd64}"

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_${BUILDX_ARCH}.zip \
    && unzip pocketbase_${POCKETBASE_VERSION}_${BUILDX_ARCH}.zip \
    && chmod +x /pocketbase

FROM node:23-alpine AS builder

RUN corepack enable
WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM alpine:3 AS production

COPY --from=downloader /pocketbase /usr/local/bin/pocketbase
COPY --from=builder /app/build /pb_public
COPY pocketbase/pb_hooks /pb_hooks
COPY pocketbase/pb_migrations /pb_migrations
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 8090

ENTRYPOINT ["/entrypoint.sh"]