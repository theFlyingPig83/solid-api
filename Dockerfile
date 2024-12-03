# Build Stage: Use the latest Node.js LTS version with Alpine Linux
FROM node:18.18.0-alpine AS builder

# Update npm to the latest version
RUN npm install -g npm@latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev && npm dedupe && npm prune

# Copy the necessary application files explicitly
COPY ./server.js /app/server.js
COPY ./src /app/src
COPY ./database /app/database
COPY ./.sequelizerc /app/


# Production Stage: Use a minimal Node.js runtime for the final image
FROM node:18.18.0-slim

# Update npm to the latest version
RUN npm install -g npm@latest

# Set the working directory
WORKDIR /app

# Copy the application files and dependencies from the builder stage
COPY --from=builder /app /app

# Set environment to production
ENV NODE_ENV=production

# Create a non-root user and set ownership
RUN groupadd appgroup && \
    useradd -g appgroup -m -d /home/hcs522 hcs522 && \
    chown -R hcs522:appgroup /app

# Switch to the non-root user
USER hcs522

# Expose the application's port
EXPOSE 5050

# Start the application
CMD ["node", "server.js"]
