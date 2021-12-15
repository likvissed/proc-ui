#!/bin/bash -xe
docker-compose -f "docker-compose.dev.yml" -p proc-ui-dev down
DOCKER_BUILDKIT=1 docker-compose -f "docker-compose.dev.yml" -p proc-ui-dev up -d --build
