// const winston = require('winston');
import winston from 'winston'; // Winston importieren

// Konfiguriere deinen Logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

// module.exports = logger;
export default logger; // Exportiere den Logger