# syntax=docker/dockerfile:1

# Base stage
FROM node:22-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Development dependencies stage
FROM base AS dev-deps
COPY package*.json ./
RUN npm ci

# Development stage
FROM dev-deps AS development
COPY . .
# Make entrypoint script executable
RUN chmod +x scripts/docker-entrypoint.sh
EXPOSE 3000
# Use entrypoint to run migrations then start app
CMD ["sh", "scripts/docker-entrypoint.sh"]

# Production stage
FROM base AS production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
