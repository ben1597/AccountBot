// const { google } = require('googleapis')
// const sheets = google.sheets('v4')

// async function main () {
//   const authClient = await authorize()
//   const request = {
//     // The spreadsheet to request.
//     spreadsheetId: 'my-spreadsheet-id', // TODO: Update placeholder value.

//     // The ranges to retrieve from the spreadsheet.
//     ranges: [], // TODO: Update placeholder value.

//     // True if grid data should be returned.
//     // This parameter is ignored if a field mask was set in the request.
//     includeGridData: false, // TODO: Update placeholder value.

//     auth: authClient
//   }

//   try {
//     const response = (await sheets.spreadsheets.get(request)).data
//     // TODO: Change code below to process the `response` object:
//     console.log(JSON.stringify(response, null, 2))
//   } catch (err) {
//     console.error(err)
//   }
// }
// main()

// async function authorize () {
//   // TODO: Change placeholder below to generate authentication credentials. See
//   // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
//   //
//   // Authorize using one of the following scopes:
//   //   'https://www.googleapis.com/auth/drive'
//   //   'https://www.googleapis.com/auth/drive.file'
//   //   'https://www.googleapis.com/auth/drive.readonly'
//   //   'https://www.googleapis.com/auth/spreadsheets'
//   //   'https://www.googleapis.com/auth/spreadsheets.readonly'
//   const authClient = null

//   if (authClient == null) {
//     throw Error('authentication failed')
//   }

//   return authClient
// }

// const { getData } = require('./services/googleSheet.js');

// (async () => {
//   const resp = await getData('1Dy6FMGd80NGuM5jmf7Chz1vgPxPCGn1XBtd-LSsGtA4', '449205789')
//   console.log(resp)
// })()

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
