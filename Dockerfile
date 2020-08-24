FROM node:12.18.3
COPY ./Published /var/run/www
WORKDIR /var/run/www
EXPOSE 3000
CMD ["npm", "run", "start:prod"]