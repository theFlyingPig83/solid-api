# Build Stage: Use the latest Node.js LTS version with Alpine Linux
FROM node:18-alpine AS builder

# Update npm to the latest version
RUN npm install -g npm@latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev && npm dedupe && npm cache clean --force

# Copy the necessary application files
COPY server.js src/ database/ .sequelizerc ./


# Prod Stage: Use a minimal Node.js runtime for the final image
FROM node:18-alpine

# Update npm to the latest version
RUN npm install -g npm@latest

# Set the working directory
WORKDIR /app

# Copy the application files and dependencies from the builder stage
COPY --from=builder /app ./

# Set environment to production
ENV NODE_ENV=production

# Create a non-root user and set ownership
RUN addgroup -S appgroup && adduser -S hcs522 -G appgroup && chown -R hcs522:appgroup /app

# Switch to the non-root user
USER hcs522

# Expose the application's port
EXPOSE 5050

# Start the application
CMD ["npm", "start"]
