// googleSheet.js
const { GoogleSpreadsheet } = require('google-spreadsheet')

const credentialsPath = '../client_secret.json'
/**
 * @param  {String} docID the document ID
 * @param  {String} sheetID the google sheet table ID
 * @param  {String} credentialsPath the credentials path defalt is './credentials.json'
 */
async function getData (docID, sheetID) {
  const result = []
  const doc = new GoogleSpreadsheet(docID)
  const creds = require(credentialsPath)
  await doc.useServiceAccountAuth(creds)
  await doc.loadInfo()
  const sheet = doc.sheetsById[sheetID]
  const rows = await sheet.getRows()
  for (const row of rows) {
    if (row._rawData[0] === '5月1日') {
      row._rawData[1] = 'test'
      row.save()
    }
    result.push(row._rawData)
  }
  return result
}

async function setData (docID, sheetID, date, header, data) {
  const doc = new GoogleSpreadsheet(docID)
  const creds = require(credentialsPath)
  await doc.useServiceAccountAuth(creds)
  await doc.loadInfo()
  const sheet = doc.sheetsById[sheetID]
  const rows = await sheet.getRows()
  for (const row of rows) {
    // if (row)
    if (row._rawData[0] === date) {
      row[header] = data
      row.save()
    }
  }
}

module.exports = {
  getData,
  setData
}
