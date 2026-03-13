const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const path = require('path');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

const nunjucksEnv = nunjucks.configure([
  path.join(__dirname, 'src/views'),
  path.join(__dirname, 'node_modules/govuk-frontend/dist')
], {
  autoescape: true,
  express: app,
  noCache: true
});

app.set('view engine', 'njk');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
  secret: 'passport-app-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/govuk', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
