
const fs = require('fs')
const http = require('http')

const writeFile = (data) => {
  fs.writeFile("public/stations_all.json", data, function(err) {
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

  fs.writeFile("public/stations_reduced.json", JSON.stringify(reduced), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("stations_reduced.json was saved!");
  }); 
}

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
