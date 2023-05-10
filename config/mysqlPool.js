const mysql = require('mysql2')
require('dotenv').config()
const typeCast = (field, useDefaultTypeCasting) => {
  // We only want to cast bit fields that have a single-bit in them. If the field
  // has more than one bit, then we cannot assume it is supposed to be a Boolean.
  if ((field.type === 'BIT') && (field.length === 1)) {
    const bytes = field.buffer()

    // A Buffer in Node represents a collection of 8-bit unsigned integers.
    // Therefore, our single "bit field" comes back as the bits '0000 0001',
    // which is equivalent to the number 1.
    return (bytes[0] === 1)
  }

  return (useDefaultTypeCasting())
}

const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE || 'game_manage',
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  typeCast
}

const poolCreate = mysql.createPool(dbConfig)
const pool = poolCreate.promise()

module.exports = pool
