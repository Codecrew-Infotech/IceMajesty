FROM node:16

# Install OpenSSL (needed for some Shopify CLI dependencies)
RUN apt-get update && apt-get install -y openssl

EXPOSE 3000

WORKDIR /app

ENV NODE_ENV=production

# Copy only package files first for caching
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm install --omit=dev && npm cache clean --force

# Remove CLI packages (optional for smaller image)
RUN npm remove @shopify/cli || true

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# Start the app
CMD ["npm", "run", "docker-start"]
