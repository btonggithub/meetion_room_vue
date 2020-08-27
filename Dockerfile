FROM node:12-alpine3.10 as meeting
WORKDIR /usr/app
COPY ./Published/package*.json ./
RUN yarn install
COPY ./Published ./
EXPOSE 3000
CMD ["yarn", "start:pm"]


# FROM nginx:1.19-alpine
# EXPOSE 80
# COPY --from=meeting /usr/app /usr/share/nginx/html
