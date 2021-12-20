#!/bin/bash -xe
docker-compose -f "docker-compose.dev.yml" -p proc-ui-dev down --remove-orphans
#docker volume rm proc-ui-dev_node_modules
DOCKER_BUILDKIT=1 docker-compose -f "docker-compose.dev.yml" -p proc-ui-dev build
DOCKER_BUILDKIT=1 docker-compose -f "docker-compose.dev.yml" -p proc-ui-dev up -d
