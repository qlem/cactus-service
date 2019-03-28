FROM node:latest

WORKDIR /home/qlem/cactus-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV NODE_ENV production

CMD [ "node", "src/app.js" ]
