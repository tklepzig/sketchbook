FROM alpine as builder
ARG azure_user
ARG azure_pwd
ARG azure_site
COPY . /app
WORKDIR /app
RUN apk add --no-cache nodejs yarn git
RUN yarn && npm run build
RUN git config user.email "deploy@docker" && git config user.name "deploy from docker"
RUN git checkout master && git add -f dist && git commit -m "deploy" && git push -f "https://${azure_user}:${azure_pwd}@${azure_site}.scm.azurewebsites.net:443/${azure_site}.git"

FROM alpine
COPY --from=builder /app/dist/ /app
WORKDIR /app
RUN apk add --no-cache nodejs yarn && yarn
EXPOSE 8080
CMD npm start
