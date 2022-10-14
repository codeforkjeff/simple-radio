
const fs = require('fs')
const http = require('http')

const path_stations_all = "public/stations_all.json"
const path_stations_reduced = "public/stations_reduced.json"

const SECONDS_WEEK = 604800

const writeFile = (data) => {
  fs.writeFile(path_stations_all, data, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("stations_all.json was saved!");
  });
}

const writeReducedFile = (data) => {
  const records = JSON.parse(data)

  const keys = ['bitrate', 'codec', 'countrycode', 'homepage', 'languagecodes', 'name', 'url']

  const reduced = records.map((record) => {
    return keys.reduce((acc, key) => {
      acc[key] = record[key]
      return acc
    }, {})
  })

  fs.writeFile(path_stations_reduced, JSON.stringify(reduced), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("stations_reduced.json was saved!");
  });
}

fs.stat(path_stations_all, (err, stats) => {
  const shouldFetch = err || (Date.now() - stats.mtime >= SECONDS_WEEK)

  if(shouldFetch) {
    console.log("Retrieving station list")
    http.get('http://de1.api.radio-browser.info/json/stations', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        writeFile(data)
        writeReducedFile(data)
      });

    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });
  } else {
    console.log("Skipping station list retrieval")
  }
})
