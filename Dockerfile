# Use a newer Node version (Shopify CLI requires Node 18+)
FROM node:18-alpine

# Install required system dependencies (e.g. OpenSSL if needed)
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy package files first for better build caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy the rest of the application source code
COPY . .

# Build the app
RUN npm run build

# Expose the app port (Shopify apps usually run on 3000)
EXPOSE 3000

# Start the app (use the appropriate command for your app)
CMD ["npm", "run", "docker-start"]
