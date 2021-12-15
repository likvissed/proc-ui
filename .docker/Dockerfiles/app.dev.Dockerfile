ARG NODE_MAJOR
FROM ***REMOVED***/registry/languages/nodejs/node:${NODE_MAJOR}-buster-slim

ARG YARN_VERSION
ARG APP_ROOT

ENV TZ=Asia/Krasnoyarsk
ENV LANG ru_RU.UTF-8
ENV LANGUAGE ru_RU:ru
ENV LC_ALL ru_RU.UTF-8

ENV DEBIAN_FRONTEND noninteractive

# Common packages
RUN apt-get update -qq && apt-get install -yq --no-install-recommends \
	gnupg2 \
	curl \
	wget \
	ca-certificates \
	locales \
	tzdata \
	vim \
	apt-file && \
    \
    apt-get clean && \
    rm -rf /var/cache/apt/archives/* && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    truncate -s 0 /var/log/*log

# Set RU locale
RUN sed -i -e 's/# ru_RU.UTF-8 UTF-8/ru_RU.UTF-8 UTF-8/' /etc/locale.gen && \
  dpkg-reconfigure locales && \
  update-locale LANG=ru_RU.UTF-8 && \
  locale-gen ru_RU.UTF-8 && \
  dpkg-reconfigure locales

# YARN
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo 'deb http://dl.yarnpkg.com/debian/ stable main' > /etc/apt/sources.list.d/yarn.list

# Install dependencies
RUN apt-get update -qq && apt-get -yq dist-upgrade && \
    apt-get install -yq --no-install-recommends && \
	yarn=${YARN_VERSION}-1 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* &&\
    truncate -s 0 /var/log/*log

RUN yarn config set registry https://nexus.***REMOVED***/repository/npm/ && \
    yarn config set @iss:registry https://gitlab.***REMOVED***/api/v4/packages/npm

# Install angular-cli
RUN yarn  global  add   @angular/cli@9.1.15 && yarn

# Create app folder
RUN mkdir -p ${APP_ROOT}
WORKDIR ${APP_ROOT}

EXPOSE 4200

STOPSIGNAL SIGTERM
