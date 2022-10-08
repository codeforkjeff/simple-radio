#!/bin/bash

if [ -z "$DEPLOY_TARGET" ]; then 
    echo "Error: set the DEPLOY_TARGET env var"
    exit 1
fi

THIS_DIR=$( dirname -- "$( readlink -f -- "$0"; )"; )
PROJECT_DIR=$( readlink -f -- "$THIS_DIR/.."; )

cd $PROJECT_DIR

rsync -avhr --delete build/ $DEPLOY_TARGET
