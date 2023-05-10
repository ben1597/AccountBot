// const { getData } = require('./googleSheet.js');

// (async () => {
//   const resp = await getData('1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4', '449205789');
//   console.log(resp);
// })();

const { listenStart, listenTest } = require('./services/telegramBot.js')
const express = require('express')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const client = require('./config/redisClient')
const logger = require('./libs/log/logger')
const app = express()

app.use(session({
  // 在express-session中间件选项中加入store就可以了
  store: new RedisStore({ client }),
  secret: process.env.SESSION_SECRET || 'isp secret',
  cookie: { secure: app.get('env') === 'production', maxAge: 86400000 },
  resave: false,
  saveUninitialized: false,
  proxy: true
}))

listenStart()
// listenCal()
listenTest()

logger.info('Listening on telegram bot')
