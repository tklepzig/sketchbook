FROM alpine as builder
ARG azure_user
ARG azure_pwd
ARG azure_site
COPY . /app
WORKDIR /app
RUN apk add --no-cache nodejs yarn git
RUN yarn && npm run build
WORKDIR /app
RUN git init
RUN git config user.email "deploy@docker" && git config user.name "deploy from docker"
RUN git add . && git add -f dist && git commit -m "deploy" && git push -f "https://${azure_user}:${azure_pwd}@${azure_site}.scm.azurewebsites.net:443/${azure_site}.git" HEAD:master
WORKDIR /app/dist
RUN yarn

FROM alpine
COPY --from=builder /app/dist/ /app
WORKDIR /app
RUN apk add --no-cache nodejs
EXPOSE 8080
CMD npm start
