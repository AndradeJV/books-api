const loginMiddleware = require('../middlewares/index')

async function authorsRoutes(fastify, options) {
  fastify.get(
    '/authors',
    { preHandler: loginMiddleware },
    async (request, reply) => {
      try {
        const query = 'SELECT * FROM authors'
        const [authors] = await fastify.mysql.query(query)

        reply.send({ success: true, authors })
      } catch (error) {
        reply.status(400).send({ error: error.message })
      }
    }
  )

  fastify.get('/authors/:id', async (request, reply) => {
    try {
      const authorId = request.params.id
      const [rows] = await fastify.mysql.query(
        'SELECT * FROM books WHERE id = ?',
        [authorId]
      )

      if (rows.length === 0) {
        throw new Error('Não foi encontrado autor(a)')
      }

      const query = `SELECT * FROM authors WHERE id = ${authorId}`
      const [author] = await fastify.mysql.query(query)

      reply.send({ success: true, author })
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })
}

module.exports = authorsRoutes
