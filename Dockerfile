FROM node:20

WORKDIR /usr/src/app

RUN npm install -g nodemon

CMD npm install && nodemon --exec ts-node src/app.ts
