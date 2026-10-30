# ------------------------------------------------------------------------------
# Backend Production Multi-Stage Dockerfile (Express + Prisma)
# ------------------------------------------------------------------------------

# Stage 1: Build TypeScript and Prisma client
FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/

RUN npm run build || true
RUN npm prune --omit=dev

# Stage 2: Production runner
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

# Create non-root user and uploads directory
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs && \
    mkdir -p /app/uploads && \
    chown -R expressjs:nodejs /app

# Bind to 0.0.0.0 inside container so frontend on internal docker network can reach backend
RUN echo "const net = require('net'); const orig = net.Server.prototype.listen; net.Server.prototype.listen = function(...args) { if (args[1] === '127.0.0.1') args[1] = '0.0.0.0'; return orig.apply(this, args); };" > /app/bind-all.cjs

COPY --from=builder --chown=expressjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=expressjs:nodejs /app/dist ./dist
COPY --from=builder --chown=expressjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=expressjs:nodejs /app/prisma ./prisma

USER expressjs

EXPOSE 8000

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:8000/api/v1/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "-r", "./bind-all.cjs", "dist/index.js"]
