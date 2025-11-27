#!/bin/sh
set -e

if [ -f ./.env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "⏳ Aguardando Postgres em $DATABASE_HOST:$DATABASE_PORT..."
until pg_isready -h "${DATABASE_HOST:-postgres}" -p "${DATABASE_PORT:-5432}" -U "${DATABASE_USER:-postgres}" > /dev/null 2>&1; do
  echo "   aguardando postgres..."
  sleep 1
done
echo "✅ Postgres pronto"

echo "➡️ Rodando migrations..."
if npm run migration:run; then
  echo "✅ Migrations aplicadas com sucesso"
else
  echo "⚠️ Falha ao aplicar migrations (ou já aplicadas). Continuando..."
fi

echo "🚀 Iniciando service..."
exec "$@"
