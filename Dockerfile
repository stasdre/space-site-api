FROM node:14.15.1-alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "start"]