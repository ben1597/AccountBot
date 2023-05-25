const logger = require('../libs/log/logger')

class Repository {
  constructor (pool) {
    this.pool = pool
  }

  async query (sql, params) {
    const sqlStr = this.pool.format(sql, params)
    logger.debug(`\x1b[31m${sqlStr}\x1b[0m`)
    const result = await this.pool.query(sqlStr)
    return result
  }

  async ping () {
    const connection = await this.pool.getConnection()
    await connection.ping()
    await connection.release()
  }
}

module.exports = Repository
