# Stage 1: Builder
FROM oven/bun:latest AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max_old_space_size=1536

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Build Next.js application
RUN bun run build

# Stage 2: Runtime
FROM oven/bun:latest

WORKDIR /app

# Copy package.json for reference
COPY package.json ./

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Copy prisma schema for migrations if needed
COPY --from=builder /app/prisma ./prisma

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD bun run --version > /dev/null || exit 1

# Expose port
EXPOSE 3000

# Start application
CMD ["bun", "run", "start"]
