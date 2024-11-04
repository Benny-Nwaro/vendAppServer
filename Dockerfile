FROM node:20.15.0-alpine

WORKDIR /server

COPY ./package.json ./

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm","run","server" ]