#!/bin/bash

CMD=$1

if [ $CMD = "frontend" ]; then
    npm run build-stations
    npm start
elif [ $CMD = "api" ]; then
    cd api
    uv run python3 -m simpleradio.db.migrate
    if [ $ENV = "dev" ]; then
        uv run uvicorn simpleradio.webapp:app --host 0.0.0.0 --reload
    elif [ $ENV = "prod" ]; then
        uv run gunicorn -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 simpleradio.webapp:app
    fi
else
    exec $@
fi
