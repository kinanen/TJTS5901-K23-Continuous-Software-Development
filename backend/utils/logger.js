const winston = require('winston');
require('winston-mongodb');
require('dotenv').config()

// Winston logger for logging events to MongoDB in JSON form for no 
// better security
const logger = winston.createLogger({
  // Default level is info and format is JSON with time log occured
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  defaultMeta: { service: 'user-service' },
  transports: [
    
    //new winston.transports.Console({format: winston.format.simple()}),
      
    // Send the error log to MongoDB
      
    new winston.transports.MongoDB({ db: process.env.MONGODB_URL, level: 'error' }),
    new winston.transports.MongoDB({ db: process.env.MONGODB_URL }),
  ],
});

// If the current environment isn't local,
// we add a console log with simple formatting
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
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
