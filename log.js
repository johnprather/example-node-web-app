// log.js attempts to export a log object which provides log.info(),
// log.warn(), log.error(), etc..

var winston = require('winston');

const logFormat = winston.format.printf(info => {
  return `${info.timestamp} [${info.level}] ${info.message}`;
});

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  )
});

module.exports = logger;
