FROM alpine
RUN apk add --update \
  --repository http://dl-3.alpinelinux.org/alpine/edge/testing \
  vips-tools \
  && rm -rf /var/cache/apk/*

FROM node:alpine
WORKDIR /usr/app

COPY ./package*.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]