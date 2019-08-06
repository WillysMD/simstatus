FROM node:lts-alpine

EXPOSE 4200/tcp

COPY ./ /web
WORKDIR /web

RUN npm install -g @angular/cli
RUN npm install

CMD ng serve --host 0.0.0.0
