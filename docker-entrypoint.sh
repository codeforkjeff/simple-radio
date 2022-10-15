#!/bin/bash

CMD=$1

if [ $CMD = "frontend" ]; then
    npm run build-stations
    npm start
elif [ $CMD = "api" ]; then
    cd api
    python3 -m simpleradio.db.migrate
    if [ $ENV = "dev" ]; then
        uvicorn simpleradio.webapp:app --host 0.0.0.0 --reload
    elif [ $ENV = "prod" ]; then
        gunicorn -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 simpleradio.webapp:app
    fi
else
    exec $@
fi
