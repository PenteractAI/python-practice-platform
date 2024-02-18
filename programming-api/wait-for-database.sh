#!/bin/sh
# wait-for-db.sh

set -e

until pg_isready -h database -U $POSTGRES_USER; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec "$@"
