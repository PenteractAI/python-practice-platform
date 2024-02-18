#!/bin/sh
# wait-for-nginx.sh

set -e

until curl -s http://localhost:7800/health > /dev/null; do
  >&2 echo "nginx is unavailable - waiting"
  sleep 1
done

>&2 echo "nginx is up - executing command"
exec "$@"
