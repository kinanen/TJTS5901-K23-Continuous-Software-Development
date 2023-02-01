const winston = require('winston');
require('winston-mongodb');
require('dotenv').config()

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    //defaultMeta: { service: 'user-service' },
    transports: [
    
      new winston.transports.Console({})
          
      //new winston.transports.MongoDB({ db: process.env.WINSTON_MONGODB_URL, level: 'error' }),
      //new winston.transports.MongoDB({ db: process.env.WINSTON_MONGODB_URL }),
    ],
  });

  module.exports = logger