# ----------------------------
# 1) BUILDER
# ----------------------------
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ----------------------------
# 2) RUNNER (produção)
# ----------------------------
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

RUN apk add --no-cache bash

# Copiando build e dependências
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# 🔥 ENTRYPOINT para rodar migrations + iniciar microserviço
COPY ./docker-entrypoint.sh /usr/local/bin/notifications-entrypoint
RUN chmod +x /usr/local/bin/notifications-entrypoint

ENTRYPOINT ["/usr/local/bin/notifications-entrypoint.sh"]
CMD ["node", "dist/main.js"]
