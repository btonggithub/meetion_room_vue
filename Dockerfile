FROM node:12-alpine3.10
WORKDIR /usr/app
COPY ./Published/package*.json ./
RUN npm install
COPY ./Published ./
EXPOSE 3000
CMD ["yarn", "start:pm"]



