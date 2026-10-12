
FROM debian:trixie-slim AS debian-src

RUN \
    apt-get update && \
    apt-get install -y curl git python3 python3-pip python3-venv sqlite3 vim virtualenvwrapper && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV PIP_CACHE_DIR=/var/cache/pip

WORKDIR /opt/simple-radio

COPY api/pyproject.toml api/uv.lock api

RUN cd api && uv sync --locked --no-dev

COPY api .

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY public ./public
COPY src ./src
COPY scripts ./scripts

COPY docker-entrypoint.sh .

EXPOSE 3000 8000

ENTRYPOINT ["./docker-entrypoint.sh"]

####

FROM debian-src as debian-compiled

RUN npm run build-stations

RUN npm run build

####

FROM nginx as nginx

ARG SERVER_NAME radio.codefork.com

COPY --from=debian-compiled /opt/simple-radio/build /usr/share/nginx/html

COPY nginx/default.conf /tmp/default.conf

RUN cat /tmp/default.conf | envsubst SERVER_NAME > /etc/nginx/conf.d/default.conf
