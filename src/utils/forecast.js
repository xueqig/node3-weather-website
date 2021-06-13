const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url =
    'http://api.weatherstack.com/current?access_key=b1b861c7c4f932f1e9d6f8c6a563e63f&query=' +
    latitude +
    ',' +
    longitude;
  // Destructure body attribute from response
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.error) {
      callback('Unable to find location!');
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          '. It is currently ' +
          body.current.temperature +
          ' degrees out.' +
          ' It feels like ' +
          body.current.feelslike +
          '. The humidity is ' +
          body.current.humidity +
          '%.',
      );
    }
  });
};

module.exports = forecast;
