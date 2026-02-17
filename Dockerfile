# Use the official Bun image
FROM oven/bun:1.1.20-alpine

# Install build dependencies required for bcrypt (or any node-gyp modules)
RUN apk add --no-cache python3 make g++


# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY bun.lockb* package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Ensure entry script is executable
RUN chmod +x ./entryPoint.sh

# Expose Fastify port
EXPOSE 4001

# Start app
CMD ["./entryPoint.sh"]
