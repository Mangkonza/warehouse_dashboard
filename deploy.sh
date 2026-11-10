#!/bin/bash
# deploy.sh - Build and run production containers for sac.eng.kps.ku.ac.th/research_and_inovation/
# Usage: bash deploy.sh

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_PATH="/research_and_inovation"

echo "==> Building backend image..."
docker build -f Dockerfile.api -t ku_warehouse_backend:latest .

echo "==> Building frontend image (BASE_PATH=${BASE_PATH})..."
docker build -f Dockerfile.web \
  --build-arg BASE_PATH="${BASE_PATH}" \
  --build-arg NEXT_PUBLIC_BASE_PATH="${BASE_PATH}" \
  --build-arg NEXT_PUBLIC_API_URL="/api/v1" \
  --build-arg BACKEND_URL="http://backend:8000" \
  -t ku_warehouse_frontend:latest .

echo "==> Stopping existing containers..."
docker stop ku_warehouse_frontend ku_warehouse_backend 2>/dev/null || true
docker rm ku_warehouse_frontend ku_warehouse_backend 2>/dev/null || true

echo "==> Creating Docker network (if not exists)..."
docker network create ku_warehouse_net 2>/dev/null || true

echo "==> Starting backend..."
docker run -d \
  --name ku_warehouse_backend \
  --network ku_warehouse_net \
  --network-alias backend \
  --env-file .env.backend \
  --add-host=host.docker.internal:host-gateway \
  -p 8000:8000 \
  ku_warehouse_backend:latest

echo "==> Starting frontend..."
docker run -d \
  --name ku_warehouse_frontend \
  --network ku_warehouse_net \
  --env-file .env.frontend \
  -p 3000:3000 \
  ku_warehouse_frontend:latest

echo "==> Done! Services running:"
echo "    Frontend: http://localhost:3000${BASE_PATH}"
echo "    Backend:  http://localhost:8000"
