ARG NODE_MAJOR
FROM ***REMOVED***/registry/languages/nodejs/node:${NODE_MAJOR}-buster-slim

ARG APP_ROOT

# Install angular-cli
RUN yarn global add @angular/cli@v9-lts

# Create app folder
RUN mkdir -p ${APP_ROOT}
WORKDIR ${APP_ROOT}

EXPOSE 4200

STOPSIGNAL SIGTERM
