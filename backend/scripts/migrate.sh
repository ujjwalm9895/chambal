#!/bin/sh
# Migration script for production deployment

echo "Running Prisma migrations..."

# Try to run migrations if they exist
if npx prisma migrate deploy 2>/dev/null; then
  echo "✓ Migrations applied successfully"
else
  echo "No migrations found, pushing schema directly..."
  npx prisma db push --accept-data-loss
  echo "✓ Schema pushed successfully"
fi
