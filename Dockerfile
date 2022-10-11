
FROM debian:bullseye-slim AS debian

RUN --mount=type=cache,mode=0777,target=/var/cache/apt \
	apt-get update && \
    apt-get install -y curl git python3 python3-pip python3-venv sqlite3 vim virtualenvwrapper

RUN --mount=type=cache,mode=0777,target=/var/cache/apt \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

ENV PIP_CACHE_DIR=/var/cache/pip

WORKDIR /opt/simple-radio

COPY api/requirements.txt api/requirements.txt

RUN --mount=type=cache,mode=0777,target=/var/cache/pip \
    pip install -r api/requirements.txt

COPY api .

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY public ./public
COPY src ./src
COPY scripts ./scripts

RUN npm run build

COPY docker-entrypoint.sh .

EXPOSE 3000 8000

ENTRYPOINT ["./docker-entrypoint.sh"]

####

FROM nginx as nginx

ARG SERVER_NAME radio.codefork.com

COPY --from=debian /opt/simple-radio/build /usr/share/nginx/html

COPY nginx/default.conf /tmp/default.conf

RUN cat /tmp/default.conf | envsubst SERVER_NAME > /etc/nginx/conf.d/default.conf
