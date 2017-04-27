const request = require('request');
const locations = require('./locations.json')


exports.askWeather = function(location, date, success, failure) {
  const code = locations[location];

  if (code !== undefined) {
    const options = {
      uri: "http://weather.livedoor.com/forecast/webservice/json/v1?city=" + code,
      method: "GET",
      json: true
    };

    request.get(options, function(error, response, body){
      if(!error && response.statusCode == 200) {
        success(body.description)
      } else {
        failure()
      }
    });

  } else {
    failure()
  }
}
