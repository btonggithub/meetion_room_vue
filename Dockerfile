FROM node:12-alpine3.10
COPY ./Published /usr/app
WORKDIR /usr/app
EXPOSE 3000
CMD ["yarn", "start:prod"]

