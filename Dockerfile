# Stage 1: Build Stage
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies, including only production dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Stage 2: Production Stage
FROM gcr.io/distroless/nodejs18:nonroot

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app .

# Expose the application port
EXPOSE 5050

# Start the application using node
CMD ["server.js"]
