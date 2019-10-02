FROM node:lts-alpine

COPY ./ /simstatus/web
WORKDIR /simstatus/web

RUN npm install -g @angular/cli
RUN npm install
RUN ng build --prod
