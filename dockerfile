FROM alpine
COPY . /app
WORKDIR /app
RUN apk add --no-cache nodejs yarn \
    && yarn \
    && npm run build \
    && cd dist \
    && yarn
WORKDIR /app/dist
CMD npm start