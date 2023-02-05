const winston = require('winston');
require('winston-mongodb');
require('dotenv').config()

// Winston logger for logging events to MongoDB in JSON form for no 
// better security
const logger = winston.createLogger({
  // Use the logging levels Winston supplies
  levels: winston.config.syslog.levels,
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: 'user-service' },
  transports: [
    // Send the error and notice logs to MongoDB
    //new winston.transports.MongoDB({ db: process.env.MONGODB_URL, level: 'error' }),
    //new winston.transports.MongoDB({ db: process.env.MONGODB_URL, level: 'notice' }),
  ],
});

// If current environment is production
// send the logs to MongoDB
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.MongoDB({ db: process.env.MONGODB_URL, level: 'error' }));
  logger.add(new winston.transports.MongoDB({ db: process.env.MONGODB_URL, level: 'notice' }));
}

// If the current environment isn't production,
// we add a console log with simple formatting
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(), level: 'info'
  }));
}

module.exports = logger

//const info = (...params) => {
  //if (process.env.NODE_ENV !== 'test') {
  //console.log(...params)
  //}
//}
  
//const error = (...params) => {
  //if (process.env.NODE_ENV !== 'test') {
    //console.log(...params)
  //}
//}
  
//module.exports = {
  //info, error
//}
