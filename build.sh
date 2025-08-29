#!/bin/bash

BUILT_TAG=latest

function clean_web {

  echo "----- Clean web -----"
  (cd web && rm -rf ./dist  && echo "clean done!") || \
     { echo "Error occured in cleaning web, aborting..."; exit 1001; }
}

function build_web {
  echo "----- Build web -----"
   (cd web && npm install && npm run build) || \
      { echo "Error occured in building web, aborting..."; exit 1001; }
}

function build_images {
    echo "----- Build docker_deps -----"
    (cd build && docker build -f ../Dockerfile.deps -t infiniflow/ragflow_deps .) || \
      { echo "Error occured in building deps, aborting..."; exit 1001; }

    echo "----- Build docker image -----"
    docker build -f ./Dockerfile_lite -t yolo-ragflow-slim:$BUILT_TAG .
}

# tag images with the specified tags and push to registry
# tags can be a tag name or a comma separated string like "latest,18.15"
# $1 -> tags
# $2 -> registry
# $3 -> namespace
# $4 -> image_prefix
function push_images {
  # get tags if specified, default to latest
  tagstr=latest
  if [ ! -z "$1" ]
  then
    tagstr=$1
  fi

  IFS=',' tags=($tagstr) # convert to array

  registry=$2
  namespace=$3
  image_prefix=$4

  if [[ -z "${namespace// }" ]]; then
    aio="$registry/$image_prefix"
  else
    aio="$registry/$namespace/$image_prefix"
  fi

  declare -a images=(
    "yolo-ragflow-slim"
  )

  for t in "${tags[@]}"
  do
    for i in "${images[@]}"
    do
      # !!! currently the build script and pom.xml has v2 for image tag
      # !!! TODO please understand the {BUILD_TAG} in the following line, should be removed after removing aliyun registry
      original_image=${i}:${BUILT_TAG}
      target_image=${aio}${i}:${t}
      echo "==========  Tag image '$original_image' as '$target_image' and push it  "

      docker tag $original_image $target_image || { echo "Failed to tag image '$original_image'"; exit 1003; }

      docker push $target_image                || { echo "Failed to push image '$target_image'"; exit 1004; }
    done
  done
}

# push images to aliyun
# $1 -> tags
function push_aliyun {
  push_images "$1" "registry.cn-hangzhou.aliyuncs.com" "tunan-tb" ""
}

function get_current_branch {
  br=`git rev-parse --abbrev-ref HEAD`
  echo $br;
}

function get_image_tags {
  if [ ! -z "$1" ]
  then
    branch=$1
  else
    branch=`get_current_branch`
  fi

  if [[ $branch == "develop" ]];
  then
    echo "develop"

  elif [[ $branch == "master" ]];
  then
    git_tag=`git tag --points-at $branch`
    if [ ! -z "$git_tag" ]
    then
      echo "latest,$git_tag"
    else
      echo "latest"
    fi
  elif [[ $branch == release/* ]];
  then
    version=`echo $branch | sed -E 's/release\/([a-zA-Z0-9\.\-_]+)/\1/' `
    echo "release,rc-$version"
  elif [[ $branch == feature/* ]];
  then
    feature_name=`echo $branch | sed -E 's/feature\/([a-zA-Z0-9\.\-_]+)/\1/' `
    echo "feature-$feature_name"
  elif [[ $branch == hotfix/* ]];
  then
    hotfix_name=`echo $branch | sed -E 's/hotfix\/([a-zA-Z0-9\.\-_]+)/\1/' `
    echo "hotfix-$hotfix_name"
  fi
}



# prompt user
read -p "========= Build Sentry-Guard Platform ======== \
 Do you want to continue (y/n)?  " answer
case ${answer:0:1} in
  y|Y )

    # clean web
    clean_web

    # build web
    build_web

    # build docker image
    build_images
  ;;

  * )
    echo "Bye..."
    # exit 1;
  ;;

esac


# prompt user
read -p "========= Push Sentry-Guard Platform ======== \
 Do you want to continue (y/n)?  " answer
case ${answer:0:1} in
  y|Y )
    tags_to_push=`get_image_tags`

    # push aliyun
    push_aliyun "$tags_to_push"
  ;;

  * )
    echo "Bye..."
    exit 1;
  ;;

esac


### READ ME FOR PUSH IMAGE ###
# docker login --username=zxy@1836402448034381 registry.cn-hangzhou.aliyuncs.com
