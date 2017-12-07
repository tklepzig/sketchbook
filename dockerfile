FROM alpine as builder
ARG azure_user
ARG azure_pwd
ARG azure_site
COPY . /app
WORKDIR /app
RUN apk add --no-cache nodejs yarn git \
    && yarn \
    && npm run build \
    && ls -l dist \
    && git config user.email "tmp@mail.com" \
    && git config user.name "tmp" \
    && git add -f dist \
    && git commit -m tmp \
    && git push -f "https://${azure_user}:${azure_pwd}@${azure_site}.scm.azurewebsites.net:443/${azure_site}.git"

FROM alpine
COPY --from=builder /app/dist/ /app
WORKDIR /app
RUN apk add --no-cache nodejs yarn && yarn
EXPOSE 8080
CMD npm start
