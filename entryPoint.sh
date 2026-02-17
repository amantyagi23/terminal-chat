#!/bin/sh

# Wait for PostgreSQL to be ready
until pg_isready -h "${PG_HOST:-localhost}" -p "${PG_PORT:-5432}" -U "${PG_USER:-aman}" > /dev/null 2>&1; do
  echo "⌛ Still waiting for PostgreSQL..."
  sleep 2
done

echo "✅ PostgreSQL is up and running!"

bun run build
bun run start
