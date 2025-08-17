FROM node:22-alpine

RUN mkdir /app
WORKDIR /app

COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY ./db ./db
COPY ./src ./src

RUN npm install
RUN npm run build

CMD ["npm", "start"]
