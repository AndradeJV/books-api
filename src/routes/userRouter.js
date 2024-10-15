async function userRoutes(fastify, options) {
  fastify.get('/users', async (request, reply) => {
    try {
      const query = 'SELECT id, username FROM users'
      const [users] = await fastify.mysql.query(query)

      reply.send({ success: true, users })
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })

  fastify.get('/users/:id', async (request, reply) => {
    try {
      const userId = request.params.id
      const [rows] = await fastify.mysql.query(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      )

      if (rows.length === 0) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }

      if (isNaN(Number(userId))) {
        throw new Error('Id deve ser um número válido')
      }

      const query = `SELECT id, username FROM users WHERE id = ?`
      const [result] = await fastify.mysql.query(query, userId)

      reply.send({ success: true, result })
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })

  fastify.put('/change/username/users/:id', async (request, reply) => {
    try {
      const userId = request.params.id
      const { username } = request.body // Acesse a propriedade correta do corpo
  
      const [rows] = await fastify.mysql.query(
        'SELECT id FROM users WHERE id = ?',
        [userId]
      )
  
      if (rows.length === 0) {
        return reply.status(404).send({ error: 'Usuário não encontrado' })
      }
  
      const query = `UPDATE users SET username = ? WHERE id = ?`
      const [updateStatus] = await fastify.mysql.query(query, [username, userId]) // Passando o userId como parâmetro
  
      reply.send({ success: true, updateStatus })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        reply.code(409).send({ message: 'Usuário já existe' })
      } else {
        reply.code(500).send({ message: 'Erro ao criar usuário' })
      }
    }
  })

  fastify.put('/change/status/users/:id', async (request, reply) => {
    try {
      const userId = request.params.id
      const status = request.body.status

      const allowedStatuses = ['Ativo', 'Bloqueado', 'Pendente']

      if (!allowedStatuses.includes(status)) {
        throw new Error(
          'Status não encontrado, tente: "Ativo", "Bloqueado" ou "Pendente"'
        )
      }

      const query = `UPDATE users set status = ? WHERE id = ?`
      const [updateStatus] = await fastify.mysql.query(query, [status, userId])

      reply.send({ success: true, updateStatus })
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })
}

module.exports = userRoutes
