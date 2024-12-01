# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Update npm to the latest version
RUN npm install -g npm@latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies, including only production dependencies
RUN npm ci --omit=dev && \
    npm dedupe && \
    npm cache clean --force

# Copy the rest of the application code
COPY . .

# Stage 2: Production Stage
FROM node:18-alpine

# Update npm to the latest version
RUN npm install -g npm@latest

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app ./

# Set the environment to production
ENV NODE_ENV=production

# Create a non-root user and group and set up permissions
RUN addgroup -S appgroup && adduser -S hcs522 -G appgroup && \
    chown -R hcs522:appgroup /app

# Switch to the non-root user
USER hcs522

# Expose the application port
EXPOSE 5050

# Start the application using node
CMD ["node", "server.js"]
