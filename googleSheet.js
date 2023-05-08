// googleSheet.js
const { GoogleSpreadsheet } = require('google-spreadsheet');

/**
 * @param  {String} docID the document ID
 * @param  {String} sheetID the google sheet table ID
 * @param  {String} credentialsPath the credentials path defalt is './credentials.json'
 */
async function getData(docID, sheetID, credentialsPath = './client_secret.json') {
  const result = [];
  const doc = new GoogleSpreadsheet(docID);
  const creds = require(credentialsPath);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsById[sheetID];
  const rows = await sheet.getRows();
  for (row of rows) {
    if(row._rawData[0] === '5月1日') {
      row._rawData[1] = 'test';
      row.save();
    }
    result.push(row._rawData);
  }
  return result;
};

module.exports = {
  getData,
};