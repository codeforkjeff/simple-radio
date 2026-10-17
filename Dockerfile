
FROM python:3.14-slim-trixie AS debian-src

RUN \
    apt-get update && \
    apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

RUN apt-get clean

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /opt/simple-radio

RUN mkdir api

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

FROM nginx:1.31.7-alpine-slim as nginx

ARG SERVER_NAME radio.codefork.com

COPY --from=debian-compiled /opt/simple-radio/build /usr/share/nginx/html
