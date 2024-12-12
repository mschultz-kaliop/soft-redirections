FROM node:18.18.0-alpine

RUN apk add curl

# Fix user / node ID
RUN USER=node && \
    GROUP=node && \
    curl -SsL https://github.com/boxboat/fixuid/releases/download/v0.5.1/fixuid-0.5.1-linux-amd64.tar.gz | tar -C /usr/local/bin -xzf - && \
    chown root:root /usr/local/bin/fixuid && \
    chmod 4755 /usr/local/bin/fixuid && \
    mkdir -p /etc/fixuid && \
    printf "user: $USER\ngroup: $GROUP\n" > /etc/fixuid/config.yml

WORKDIR /usr/src/app

EXPOSE 3000

COPY . /usr/src/app/

RUN apk update && apk add bash

RUN npm ci

ENTRYPOINT ["./start.sh"]
