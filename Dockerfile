# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Update npm
RUN npm install -g npm@latest

# Explicitly create the /app directory and set it as the working directory
RUN mkdir -p /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev && \
    npm dedupe && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy necessary application files
COPY server.js ./server.js
COPY src/ ./src
COPY database/ ./database
COPY .sequelizerc ./

# Stage 2: Production Stage
FROM node:18-alpine

# Update npm
RUN npm install -g npm@latest

# Explicitly create the /app directory and set it as the working directory
RUN mkdir -p /app
WORKDIR /app

# Copy node_modules and application files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/src ./src
COPY --from=builder /app/database ./database
COPY --from=builder /app/.sequelizerc ./

# Set environment to production and create a non-root user
ENV NODE_ENV=production
RUN addgroup -S appgroup && adduser -S hcs522 -G appgroup && chown -R hcs522:appgroup /app

# Switch to the non-root user
USER hcs522

# Expose port and start the application
EXPOSE 5050
CMD ["node", "server.js"]
