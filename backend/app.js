const path = require('path')
const config = require('./utils/config')
const express = require('express')
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const app = express()
require("dotenv").config()
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const { userExtractor } = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const itemsRouter = require('./controllers/items')
//require('express-async-errors')

// Connecting to the database using mongoose
mongoose.connect(config.MONGODB_URL)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
})

// Using the production build that's created from the React app
// so that it can be accesed from the backend URL
app.use(express.static('build'))

app.use(express.json())

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use('/api/items', userExtractor, itemsRouter)
app.use('/api/users', userExtractor, usersRouter)
app.use('/api/login', loginRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.get('/server-info', (req, res) => {
    res.send('<p>This will (hopefully) show the same server info as the Python file app.py</p>')
})

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

module.exports = app
