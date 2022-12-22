
# simple-radio

I listen to FM radio streams a lot. I hate having browser tabs open for each station.
Radio streaming websites and media player apps are overly complicated to 
configure and to use. All I freakin want is to have station presets and to play streams
with a SINGLE click or keypress. You know, like a simple radio.

https://radio.codefork.com

## Features

- Add streams/stations from a searchable list or by entering your own stream URLs
- Saved stream lists are shareble with others

## Local Development

```sh
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Production Deploy

```sh
ENV=prod docker compose up --build -d
```
