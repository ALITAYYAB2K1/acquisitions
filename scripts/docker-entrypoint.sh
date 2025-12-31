#!/bin/sh
set -e

echo "Waiting for Neon Local to be ready..."
sleep 10

echo "Starting application..."
exec npm run dev
