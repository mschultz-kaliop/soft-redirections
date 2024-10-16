FROM node:18.18.0-alpine

WORKDIR /usr/src/app

EXPOSE 3000

COPY . /usr/src/app/

RUN apk update && apk add bash

RUN npm ci

CMD npm run build && npm run dev
