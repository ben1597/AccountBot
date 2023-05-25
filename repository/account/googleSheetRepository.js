const Repository = require('../baseRepository')
const pool = require('../../config/mysqlPool')

class GoogleSheetRepository extends Repository {
  async getRecord (chartId) {
    const whereConditions = {
      chartId
    }

    const whereClause = Object.keys(whereConditions)
      .map(key => `${key} = ?`)
      .join(' AND ')

    const sql = `select * from account.google_sheet where ${whereClause} limit 1`

    const params = Object.values(whereConditions)

    const [rows] = await this.query(sql, params)
    return [rows][0]
  }

  async insertRecord (record) {
    const sql = 'insert into account.google_sheet(chartId, docId, sheetId) values( ?, ?, ?)'
    await this.query(sql, [record.chartId, record.docId, record.sheetId])
  }
}

module.exports = new GoogleSheetRepository(pool)
