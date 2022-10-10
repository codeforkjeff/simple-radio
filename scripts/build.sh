#!/bin/bash
THIS_DIR=$( dirname -- "$( readlink -f -- "$0"; )"; )
PROJECT_DIR=$( readlink -f -- "$THIS_DIR/.."; )

cd $PROJECT_DIR
react-scripts build || exit 1

GIT_SHA=$(git rev-parse --short HEAD)

echo $GIT_SHA > build/version.txt
