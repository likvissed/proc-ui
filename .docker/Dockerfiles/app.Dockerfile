ARG NODE_MAJOR
FROM ***REMOVED***/registry/languages/nodejs/node:${NODE_MAJOR}-buster-slim AS builder

ARG ENVIRONMENT
ARG APP_ROOT
WORKDIR ${APP_ROOT}

# Install angular-cli
RUN yarn global add @angular/cli@v10-lts

COPY package.json yarn.lock .
RUN yarn

COPY . .
RUN yarn run build ----configuration=${ENVIRONMENT}

# Deploy
FROM nginx:1.21.4-alpine
ARG APP_HOSTNAME

COPY .docker/nginx/nginx.conf /tmp/nginx.conf
RUN envsubst '${APP_HOSTNAME}' < /tmp/nginx.conf > /etc/nginx/conf.d/nginx.conf
COPY ./.docker/tls/ /etc/pki/tls/nginx/

COPY --from=builder /app/dist/appProc /app/public