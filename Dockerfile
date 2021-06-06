FROM node:alpine

RUN mkdir -p /usr/src/getir && chown -R node:node /usr/src/getir

WORKDIR /usr/src/getir

COPY package.json yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000

CMD yarn start