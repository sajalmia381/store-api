### STAGE 1: Build App
FROM node:16.13.1-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

EXPOSE 8000

CMD [ "node", "src/app.js" ]