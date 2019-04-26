FROM node:carbon-alpine

ENV DEBUG expresso:*,gg:*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

## Install dependencies
COPY ["./package.json", "./package-lock.json", "/usr/src/app/"]

RUN npm i

## Add source code
COPY ["./src", "./tsconfig.json", "/usr/src/app/"]

## Build
RUN npm run build:clean

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
