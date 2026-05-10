# Use node-20 as a base
FROM node:20-alpine AS base

ARG SERVICE_NAME=alexplain

# 1. prune phase
FROM base AS pruner

# install deps
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm i -g pnpm turbo@^2
RUN pnpm config set store-dir ~/.pnpm-store

# copy over the entire ts directory
COPY ts/ .

# generate the pruned artifacts required to build the next service
RUN turbo prune ${SERVICE_NAME} --docker

# 2. install + build phase
FROM base AS builder

ARG JAX_GATEWAY
ENV JAX_GATEWAY=${JAX_GATEWAY}

# install deps
RUN apk update
RUN apk add --no-cache libc6-compat
RUN npm i -g pnpm turbo@^2
RUN pnpm config set store-dir ~/.pnpm-store

# declare a workdir (where we run commands / copy resources)
WORKDIR /app

# copy pruned dependency artifacts from the pruner
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .
# Copy .pnpmfile.cjs before install (turbo prune doesn't copy dotfiles)
COPY --from=pruner /app/.pnpmfile.cjs ./.pnpmfile.cjs

# install dependencies
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

# copy pruned source code from the pruner
COPY --from=pruner /app/out/full/ .

# CRITICAL: turbo prune doesn't copy non-source files from packages
COPY --from=pruner /app/packages/typescript-config/ ./packages/typescript-config/

# Build the next app with its dependencies using turbo
RUN JAX_GATEWAY=${JAX_GATEWAY} turbo run build --filter=${SERVICE_NAME}...

# 3. run phase - Node.js server for ISR
FROM base AS runner

ARG SERVICE_NAME=alexplain
ENV SERVICE_NAME=${SERVICE_NAME}

# Install curl for health checks
RUN apk add --no-cache curl libc6-compat

WORKDIR /app

# Set up user to run our build
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/apps/${SERVICE_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${SERVICE_NAME}/.next/static ./apps/${SERVICE_NAME}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${SERVICE_NAME}/public ./apps/${SERVICE_NAME}/public

# Create cache directory for ISR with proper permissions
RUN mkdir -p /app/apps/${SERVICE_NAME}/.next/cache && chown -R nextjs:nodejs /app/apps/${SERVICE_NAME}/.next/cache

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["node", "apps/alexplain/server.js"]
