FROM node:alpine as builder
WORKDIR /usr/app

COPY package.json ./
RUN npm install
COPY ./src ./src
COPY ./public ./public
COPY ./.env ./.env
RUN npm run build

FROM nginx
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/build /usr/share/nginx/html