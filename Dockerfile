FROM node:18.13.0

WORKDIR /app

#COPY --chown=node:node . .

COPY . .

RUN npm install

#USER node

EXPOSE 3001

CMD npm start