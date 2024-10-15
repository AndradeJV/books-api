const fastifyPlugin = require('fastify-plugin')
require('dotenv').config()

async function mysqlConnector(fastify, options) {
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD
  const database = process.env.DB_DATABASE
  const host = process.env.DB_HOST

  fastify.register(require('fastify-mysql'), {
    promise: true,
    connectionString: `mysql://${user}:${password}@${host}:3306/${database}`,
  })
}

module.exports = fastifyPlugin(mysqlConnector)
