# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . .

CMD ["node", "src/server.js"]
EXPOSE 3000
