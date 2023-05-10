const { createClient } = require('redis')
require('dotenv').config()

const client = createClient({
  url: process.env.REDIS_URL,
  database: parseInt(process.env.REDIS_DATABSE),
  // Use legacy mode to preserve the backwards compatibility of commands while still getting access to the updated experience
  legacyMode: true
})
client.connect().catch(console.error)

module.exports = client
