FROM node:lts-alpine

RUN mkdir /code
WORKDIR /code

COPY . /code

EXPOSE 3000

CMD ["node", "index.js"]

