FROM node:18.4.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

EXPOSE 4500
CMD [ "npm", "start"]
