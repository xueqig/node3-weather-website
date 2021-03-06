const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  // Use res.render to render the template (templates are in /templates/views)
  // First argument is template name
  // Second argument is an object that contains all variables the template should know when rendering
  res.render('index', {
    title: 'Weather',
    name: 'Xueqi Guan',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Xueqi',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    helpText: 'This is some helpful text.',
    title: 'Help',
    name: 'Xueqi Guan',
  });
});

app.get('/weather', (req, res) => {
  // Get address from url
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address',
    });
  }

  // Get latitude, longitutde, location from geocode, use object destructuring
  geocode(
    req.query.address,
    (error, { latitude, longitutde, location } = {}) => {
      if (error) {
        return res.send({ error: error });
      }

      // Use latitude, longitutde to get weather forecast
      forecast(latitude, longitutde, (error, forecastData) => {
        if (error) {
          return res.send({ error: error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    },
  );
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Xueqi Guan',
    errorMessage: 'Help article not found',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    tilte: '404',
    name: 'Xueqi Guan',
    errorMessage: 'My 404 page',
  });
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});
