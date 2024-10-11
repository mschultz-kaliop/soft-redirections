FROM node:18.18.0-alpine
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app/

RUN apk update && apk add bash

RUN npm i

RUN npm install --location=global nodemon

# RUN npm install --location=global contentful-cli

# RUN npm install sharp
# RUN npm link sharp

EXPOSE 4000

CMD [ "npm", "run", "start" ]
