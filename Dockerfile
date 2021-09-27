# syntax=docker/dockerfile:1

FROM node:14.15.4

WORKDIR /src

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . .

CMD [ "npm", "start" ]