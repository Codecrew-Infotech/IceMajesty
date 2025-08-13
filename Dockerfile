# Use Node 18 as base
FROM node:18

# Expose port for Railway
EXPOSE 3000

# Set working directory
WORKDIR /app

# Copy only package.json + lock file first for caching
COPY package*.json ./

# Copy prisma schema (needed for build + migrations)
COPY prisma ./prisma

# Set environment
ENV NODE_ENV=production

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Build the application
RUN npm run build

# OPTIONAL: Remove dev-only CLI packages AFTER build
RUN npm remove @shopify/app @shopify/cli || true

# If you were using SQLite in dev, remove it for prod
RUN rm -f prisma/dev.sqlite || true

# Set start command for Railway
CMD ["npm", "run", "docker-start"]
