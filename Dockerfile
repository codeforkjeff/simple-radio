
FROM debian:bullseye-slim

RUN --mount=type=cache,mode=0777,target=/var/cache/apt \
	apt-get update && \
    apt-get install -y curl python3 python3-pip python3-venv sqlite3 vim virtualenvwrapper

RUN --mount=type=cache,mode=0777,target=/var/cache/apt \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

ENV PIP_CACHE_DIR=/var/cache/pip

WORKDIR /opt/simple-radio

COPY api/requirements.txt api/requirements.txt

RUN --mount=type=cache,mode=0777,target=/var/cache/pip \
    pip install -r api/requirements.txt

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

RUN npm build

EXPOSE 3000 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
