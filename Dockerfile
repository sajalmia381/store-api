### STAGE 1: Build App
FROM node:16.13.1-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm install -g typescript

EXPOSE 8000

CMD [ "npm", "src/app.js" ]
