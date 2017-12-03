FROM alpine
COPY . /app
WORKDIR /app
RUN apk add --no-cache nodejs yarn \
    && yarn \
    && npm run build \
    && rm -rf node_modules \
    && rm -rf src \
    && cd dist \
    && yarn
WORKDIR /app/dist
CMD npm start