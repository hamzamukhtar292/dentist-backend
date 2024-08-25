FROM node:18.0
WORKDIR /src/usr/app
COPY ./package.json .
COPY ./package-lock.json .

RUN pnpm i

