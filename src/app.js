const fastify = require('fastify')({ logger: true })
const mysqlConnector = require('./database/books')
const booksRouter = require('./routes/booksRouter')
const authorsRouter = require('./routes/authorsRouter')
const loginRouter = require('./routes/loginRouter')
const userRouter = require('./routes/userRouter')

fastify.register(mysqlConnector)
fastify.register(booksRouter)
fastify.register(authorsRouter)
fastify.register(loginRouter)
fastify.register(userRouter)

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
