const fastify = require('fastify')({ logger: true })
const mysqlConnector = require('./database/books')
const booksRouter = require('./routes/booksRouter')
const authorsRouter = require('./routes/authorsRouter')

fastify.register(mysqlConnector)
fastify.register(booksRouter)
fastify.register(authorsRouter)

const start = async () => {
  try {
    const PORT = process.env.PORT || 3000
    await fastify.listen({ port: PORT, host: 'localhost' })

    console.log(`Servidor rodando em http://localhost:${PORT}`)
  } catch (error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
