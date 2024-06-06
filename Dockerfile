FROM node:20.14.0-alpine

WORKDIR /usr/src/ec_prayer_times_app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]
