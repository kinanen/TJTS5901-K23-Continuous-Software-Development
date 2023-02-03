const winston = require('winston');
require('winston-mongodb');
require('dotenv').config()


//const logger = winston.createLogger({
    //level: 'info',
    //format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    //defaultMeta: { service: 'user-service' },
    //transports: [
    
      //new winston.transports.Console({}),
          
      //new winston.transports.MongoDB({ db: process.env.MONGODB_URL, level: 'error' }),
      //new winston.transports.MongoDB({ db: process.env.MONGODB_URL }),
    //],
  //});

  //if (process.env.NODE_ENV !== 'production') {
    //logger.add(new winston.transports.Console({
      //format: winston.format.simple(),
    //}));
  //}

  //module.exports = logger

  const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(...params)
    }
  }
  
  const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(...params)
    }
  }
  
  module.exports = {
    info, error
  }