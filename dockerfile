FROM alpine
RUN apk add --no-cache nodejs yarn
COPY ./dist /app
WORKDIR /app
RUN yarn
CMD npm run start