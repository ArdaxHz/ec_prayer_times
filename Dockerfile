FROM node:20.14.0-alpine

RUN apk add --no-cache git

WORKDIR /usr/src/ec_prayer_times_app

RUN git clone https://github.com/AbdulrahmanHadz/ec_prayer_times.git .

RUN npm install

RUN npm build

EXPOSE 5164

CMD [ "node", ".output/server/index.mjs" ]