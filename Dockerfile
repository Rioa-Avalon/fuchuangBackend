FROM node:16

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install

COPY . .

ENV DATABASE_URL=mongodb://mongodb:27017/traffic

EXPOSE 8080
CMD [ "node", "server.js" ]