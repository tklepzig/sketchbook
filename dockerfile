FROM alpine
COPY ./dist /app
WORKDIR /app
RUN apk add --no-cache nodejs yarn && yarn
CMD npm run start