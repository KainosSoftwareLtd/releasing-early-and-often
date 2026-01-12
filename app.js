const express = require('express');
const nunjucks = require('nunjucks');
const session = require('express-session');
const path = require('path');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Nunjucks
const nunjucksEnv = nunjucks.configure([
  path.join(__dirname, 'src/views'),
  path.join(__dirname, 'node_modules/govuk-frontend/dist')
], {
  autoescape: true,
  express: app,
  noCache: true
});

app.set('view engine', 'njk');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'passport-app-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Static files - serve GOV.UK Frontend assets
// The precompiled CSS references /assets/* paths, so we mount assets directory there
app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk/assets')));
app.use('/govuk', express.static(path.join(__dirname, 'node_modules/govuk-frontend/dist/govuk')));

// Routes
app.use('/', routes);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
