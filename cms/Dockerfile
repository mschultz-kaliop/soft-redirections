FROM node:18-alpine3.18

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/
COPY package.json package-lock.json ./

RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm ci

ENV PATH=/usr/node_modules/.bin:$PATH

WORKDIR /usr/app
COPY . .

RUN chown -R node:node /usr/app
USER node

RUN ["npm", "run", "build"]
EXPOSE 1337

CMD ["npm", "run", "develop"]