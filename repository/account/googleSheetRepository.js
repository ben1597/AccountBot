const Repository = require('../baseRepository')
const pool = require('../../config/mysqlPool')

class GoogleSheetRepository extends Repository {
  async getRecord (chatId) {
    const whereConditions = {
      chatId
    }

    const whereClause = Object.keys(whereConditions)
      .map(key => `${key} = ?`)
      .join(' AND ')

    const sql = `select * from account.google_sheet where ${whereClause} limit 1`

    const params = Object.values(whereConditions)

    const [rows] = await this.query(sql, params)
    return [rows][0][0]
  }

  async insertRecord (record) {
    const sql = 'insert into account.google_sheet(chatId, docId, sheetId) values( ?, ?, ?)'
    const [rows] = await this.query(sql, [record.chatId, record.docId, record.sheetId])
    return [rows][0]
  }

  async updateRecord (record) {
    const sql = 'update account.google_sheet set docId = ?, sheetId = ? where chatId = ?'
    const [rows] = await this.query(sql, [record.docId, record.sheetId, record.chatId])
    return [rows][0]
  }
}

module.exports = new GoogleSheetRepository(pool)
