# ----------------------------
# 1) BUILD
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ----------------------------
# 2) RUNNER
# ----------------------------
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Dependências para pg_isready
RUN apk add --no-cache postgresql-client bash

# Copia arquivos compilados + node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copia tsconfig, src e datasource para migrations
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json
COPY --from=builder /usr/src/app/tsconfig.build.json ./tsconfig.build.json
COPY --from=builder /usr/src/app/data-source.ts ./data-source.ts
COPY --from=builder /usr/src/app/package*.json ./

# Entrypoint
COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=production

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
