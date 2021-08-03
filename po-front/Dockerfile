FROM node:12 as build

ADD . /app

WORKDIR /app

RUN yarn install

COPY . .

FROM gcr.io/distroless/nodejs:12

COPY --from=build /app /app

USER 1000

CMD ["yarn", "start"]
