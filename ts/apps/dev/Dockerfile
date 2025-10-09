# Use node-20 as a base
FROM node:20-alpine AS base

ARG SERVICE_NAME=dev

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

# TODO (amiller68): this should really be using the secrets functionality
#  implemented by kamal for something like this: https://kamal-deploy.org/docs/configuration/builders/#referencing-build-secrets
# Accept build arg for Quotient private key (needed for build-time data fetching)
ARG QUOTIENT_PRIVATE_API_KEY
ENV QUOTIENT_PRIVATE_API_KEY=${QUOTIENT_PRIVATE_API_KEY}
ARG NEXT_PUBLIC_QUOTIENT_API_KEY
ENV NEXT_PUBLIC_QUOTIENT_API_KEY=${NEXT_PUBLIC_QUOTIENT_API_KEY}
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

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

# CRITICAL: turbo prune doesn't copy non-source files from packages or branding
# We need to manually copy the typescript-config files
# Branding is at the root level, needs to be copied relative to build context
COPY --from=pruner /app/packages/typescript-config/ ./packages/typescript-config/

# Build the next app with its dependencies using turbo
# Explicitly pass QUOTIENT_PRIVATE_API_KEY to the build process
RUN QUOTIENT_PRIVATE_API_KEY=${QUOTIENT_PRIVATE_API_KEY} turbo run build --filter=${SERVICE_NAME}...

# 3. run phase - Node.js server for ISR
FROM base AS runner

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
ENV QUOTIENT_PRIVATE_API_KEY=${QUOTIENT_PRIVATE_API_KEY}
ENV NEXT_PUBLIC_QUOTIENT_API_KEY=${NEXT_PUBLIC_QUOTIENT_API_KEY}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD node apps/${SERVICE_NAME}/server.js
