FROM node:20-alpine AS build
WORKDIR /app

# Instalar Nest CLI global
RUN npm install -g @nestjs/cli

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
RUN npm prune --production
EXPOSE 3000
CMD ["node", "dist/main.js"]
