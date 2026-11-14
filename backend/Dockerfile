FROM node:20-alpine

WORKDIR /app

# Copiamos primero package.json para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos el resto del código (server.js)
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]