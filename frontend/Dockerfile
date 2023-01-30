FROM node:18.13.0 AS build-stage

WORKDIR /app/frontend

COPY . .

RUN npm install

EXPOSE 3000



#COPY . .

#ENV REACT_APP_BACKEND_URL=http://localhost:3001

#RUN npm install react-scripts --silent

RUN npm run build

FROM nginx:1.23

COPY --from=build-stage /app/frontend/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]