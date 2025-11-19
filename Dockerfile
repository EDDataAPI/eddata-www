# Build stage
FROM node:24-bookworm-slim AS builder

# Set working directory
WORKDIR /app

# Install dependencies for better caching
# Copy only package files first
COPY package*.json ./

# Install dependencies with production optimizations
# Using npm install instead of npm ci for better platform compatibility
# DOCKER_BUILD=1 prevents husky installation
RUN DOCKER_BUILD=1 npm install --omit=dev --prefer-offline --no-audit && npm cache clean --force

# Copy application files
COPY . .

# Build Next.js application
RUN npm run build

# Production stage
FROM node:24-bookworm-slim AS runner

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
# Standalone mode requires public and static in specific locations
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./.next/standalone/public

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variable for port
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
