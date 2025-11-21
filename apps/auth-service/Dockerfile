# ================
# 1. Build Stage
# ================
FROM node:18-alpine AS builder

# Pasta de trabalho
WORKDIR /app

ENV NODE_ENV=development

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia o código fonte
COPY . .

# Build da aplicação
RUN npm run build


# ================
# 2. Production Stage
# ================
FROM node:18-alpine AS production

WORKDIR /app

# Copia somente node_modules e build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Define porta (caso use HTTP)
EXPOSE 3001

# Comando padrão
CMD ["node", "dist/main.js"]
