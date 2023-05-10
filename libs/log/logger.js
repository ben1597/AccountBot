const fs = require('fs')
const path = require('path')
const winston = require('winston')
const { createLogger, format, transports } = require('winston'); require('winston-daily-rotate-file')
const { combine, timestamp, json, printf, colorize, errors } = format
const logsFolder = path.join(__dirname, '../../logs/')
if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder)
}

const levels = {
  error: 0,
  info: 1,
  http: 2,
  warn: 3,
  debug: 4
}

const colors = {
  error: 'red',
  info: 'green',
  http: 'magenta',
  warn: 'yellow',
  debug: 'cyan'
}

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors)

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} ${level}: ${typeof message === 'object' && message !== null ? JSON.stringify(message, null, 4) : message}\n ` + `${metadata.stack ? JSON.stringify(metadata, null, 4) : ''}`
})

module.exports = createLogger({
  level: level(),
  levels,
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    json(),
    errors({ stack: true })
  ),
  // 設定此 logger 的日誌輸出器
  transports: [
    new transports.Console({
      level: level(),
      format: combine(colorize(), logFormat)
    }),
    new transports.DailyRotateFile({
      filename: logsFolder + '%DATE%.log',
      json: true,
      datePattern: 'YYYYMMDD',
      maxFiles: '30d'
    })
  ]
})
