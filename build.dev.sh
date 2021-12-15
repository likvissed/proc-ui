#!/bin/bash -xe
docker-compose -f "docker-compose.dev.yml" -p proc-ui-dev down --remove-orphans
DOCKER_BUILDKIT=1 docker-compose -f "docker-compose.dev.yml" -p proc-ui-dev build  --build-arg http_proxy=$http_proxy --build-arg https_proxy=$https_proxy --build-arg no_proxy=$no_proxy
DOCKER_BUILDKIT=1 docker-compose -f "docker-compose.dev.yml" -p proc-ui-dev up -d
