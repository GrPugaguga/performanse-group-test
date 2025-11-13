# STAGE 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

COPY knexfile.js ./
COPY src/database ./src/database

EXPOSE 3000

CMD ["node", "dist/main"]
