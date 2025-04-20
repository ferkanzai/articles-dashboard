#!/bin/bash

set -e

# Wait for the DB file to exist
echo "Waiting for the database to be ready..."
while [ ! -f /data/articles.db ]; do
  sleep 1
done

# Run migrations and seeds
echo "Running database migrations and seeds..."
node dist/src/db/scripts/migrate.js || {
  echo "Migration failed"
  exit 1
}

node dist/src/db/scripts/seed.js || {
  echo "Seed failed"
  exit 1
}

# Start the app
echo "Starting the app..."
exec node dist/src/index.js
