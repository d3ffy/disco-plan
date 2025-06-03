FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

ENV SQLITE3_FORCE_BUILD=1

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose port for auth server
EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["node", "src/index.js"]