# Nuxt 4 requires node ^20.19.0 || >=22.12.0. Keep in sync with .nvmrc — on an
# older node, npm silently skips oxc-parser's native binding (it is an optional
# dependency gated on the same engine range) and `nuxt prepare` then fails with
# "Cannot find native binding".
FROM node:22.16.0-alpine

WORKDIR /usr/src/ec_prayer_times_app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]
