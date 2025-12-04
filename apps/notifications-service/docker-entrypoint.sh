#!/bin/sh
set -e

# Carrega variáveis do .env se existir
if [ -f ./.env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "⏳ Aguardando RabbitMQ..."
until nc -z rabbitmq 5672; do
  echo "  ➤ RabbitMQ ainda iniciando..."
  sleep 1
done
echo "🐇 RabbitMQ pronto!"


### 🔥 GERA O DIST SE NÃO EXISTIR
if [ ! -d "./dist" ]; then
  echo "📌 Nenhum dist encontrado — gerando build..."
  npm run build
fi


### 🔥 RODA MIGRATIONS SE EXISTIREM
if ls src/migrations/*.ts 1> /dev/null 2>&1; then
  echo "📦 Rodando migrations de Notification Service..."
  npm run migration:run || true
else
  echo "⚠ Nenhuma migration encontrada — continuando..."
fi


echo "🚀 Iniciando Notifications Service..."
exec "$@"
