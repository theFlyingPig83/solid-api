# Build Stage: Use the latest Node.js LTS version with Alpine Linux
FROM node:18-alpine AS builder

# Update npm to the latest version and set the working directory
RUN npm install -g npm@latest
WORKDIR /app

# Copy package.json and package-lock.json and install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm dedupe && npm prune

# Copy the necessary application files
COPY . ./app

# Compile using ncc to minify image size
RUN npx ncc build server.js -o dist


# Production Stage: Use a minimal Node.js runtime for the final image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy the compiled application from the builder stage
COPY --from=builder /app/dist /app

# Set environment to production
ENV NODE_ENV=production

# Create a non-root user and set ownership
RUN addgroup -S appgroup && adduser -S hcs522 -G appgroup && chown -R hcs522:appgroup /app

# Switch to the non-root user
USER hcs522

# Expose the application's port
EXPOSE 5050

# Start the application
CMD ["node", "server.js"]
