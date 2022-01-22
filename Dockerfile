### STAGE 1: Build App
FROM node:16.13.1-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

### STAGE 2: Production app
FROM node:16.13.1-alpine As production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod

COPY . .

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 8000

CMD [ "node", "dist/app.js" ]