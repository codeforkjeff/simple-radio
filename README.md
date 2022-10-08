
# simple-radio

I listen to FM radio streams a lot. I hate having browser tabs open for each station.
Radio streaming websites and media player apps are overly complicated to 
configure and to use. All I freakin want is to have station presets and to play streams
with a SINGLE click or keypress. You know, like a simple radio.

https://radio.codefork.com

## Features / Goals

- No backend (KISS)
- TODO: Add streams/stations from a searchable list
- TODO: Save presets to html5 local storage
- TODO: show "now playing" info from streams

## Local Development

The stack is just React. Install Node.js (I used 16.x), then run:

```sh
# install packages
npm install
# get radio station data
npm run build-stations
# start dev server
npm start
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
