# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies using npm ci
RUN npm ci --production

# Copy all application files
COPY . .

# Stage 2: Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy application files from the builder stage
COPY --from=builder /app .

# Create a non-root user and set permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /app && \
    chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE 5050

# Start the application
CMD ["node", "server.js"]
