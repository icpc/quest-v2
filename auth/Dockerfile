FROM node:23-alpine AS base
FROM base AS builder

RUN corepack enable
WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM base
WORKDIR /app
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
ENV NODE_ENV=production
CMD ["node", "./dist/index.js"]