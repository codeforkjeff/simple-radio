
# simple-radio

I listen to FM radio streams a lot. I hate having browser tabs open for each station.
Radio streaming websites and media player apps are overly complicated to 
configure and to use. All I freakin want is to have station presets and to play streams
with a SINGLE click or keypress. You know, like a simple radio.

https://radio.codefork.com

## Features / Goals

- TODO: Add streams/stations from a searchable list
- TODO: Save presets to html5 local storage
- TODO: show "now playing" info from streams

## Local Development

```
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Build

```sh
npm run build
```

Serve the contents of `build/` somewhere.

## Deploy

This just rsync's the built assets.

```sh
DEPLOY_TARGET="user@somewhere:/some/dir" npm run deploy
```
