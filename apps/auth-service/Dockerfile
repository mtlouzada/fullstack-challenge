FROM node:20-alpine

WORKDIR /usr/src/app

# instalar dependências (inclui dev para ts-node)
COPY package*.json ./
RUN npm ci

# copiar código
COPY . .

# build (gera dist)
RUN npm run build

# rodar migrations (usando ts-node na imagem que tem devDeps)
RUN npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./data-source.ts || echo "migrations may have been already applied"

EXPOSE 3001
CMD ["node", "dist/main.js"]
