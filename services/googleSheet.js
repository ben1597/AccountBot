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

  // await sheet.loadCells('A1:S35')
  // sheet.getCellByA1('C6').value = '123'
  // sheet.getCellByA1('C6').note = '123'
  // await sheet.saveUpdatedCells()

  const rows = await sheet.getRows()
  for (const row of rows) {
    result.push(row._rawData)
  }
  return result
}

async function setData (docID, sheetID, date, header, money, memo) {
  const doc = new GoogleSpreadsheet(docID)
  const creds = require(credentialsPath)
  await doc.useServiceAccountAuth(creds)
  await doc.loadInfo()
  const sheet = doc.sheetsById[sheetID]
  await sheet.loadCells('A1:T36')

  const day = parseInt(date.split('/')[1]) + 3
  sheet.getCellByA1(header + day).value = money
  sheet.getCellByA1(header + day).note = memo
  await sheet.saveUpdatedCells()

  // sheet.getCell(5, 3).value = '123'
  // sheet.getCell(5, 3).note = '123'

  // const rows = await sheet.getRows()
  // for (const row of rows) {
  //   // if (row)
  //   if (row._rawData[0] === date) {
  //     row[header] = data
  //     row.save()
  //   }
  // }
}

module.exports = {
  getData,
  setData
}
