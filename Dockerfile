FROM node:18.13.0

WORKDIR /app/backend

COPY . .

RUN npm install

EXPOSE 5001

CMD npm start