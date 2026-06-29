FROM node:20

WORKDIR /app

COPY package*.json ./
COPY patches/ ./patches/

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "docker-start"]
