FROM node:8
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY ./build ./build
EXPOSE 5000
CMD ["npm", "run", "serve"]