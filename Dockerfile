FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install everything (dev deps needed for build)
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "docker-start"]
