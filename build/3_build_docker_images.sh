#!/bin/bash

cd ..

docker build --build-arg LIGHTEN=1 --build-arg NEED_MIRROR=1 -f Dockerfile -t infiniflow/ragflow:nightly-slim .

cd build
