#!/bin/bash

CMD=$1

if [ $CMD = "frontend" ]; then
    npm start
elif [ $CMD = "api" ]; then
    cd api
    uvicorn simpleradio.webapp:app --host 0.0.0.0 --reload
else
    exec $@
fi
