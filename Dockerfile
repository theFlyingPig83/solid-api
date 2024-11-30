# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Stage 2: Production Stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app .

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5050
CMD ["node", "server.js"]
