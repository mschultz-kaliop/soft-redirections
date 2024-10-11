FROM node:18.18.0-alpine

WORKDIR /usr/src/app

EXPOSE 3000

# Bundle app source
COPY . /usr/src/app/

RUN apk update && apk add bash

RUN npm i

CMD npm run build && npm run start
