FROM node:alpine
WORKDIR /usr/app

COPY package.json ./
RUN npm install
COPY . .

ENV NODE_ENV=production
CMD ["npm", "start"]