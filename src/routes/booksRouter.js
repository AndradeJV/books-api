async function booksRoutes(fastify, options) {
  fastify.get('/books', async (request, reply) => {
    try {
      const query = `SELECT * FROM books`
      const [result] = await fastify.mysql.query(query)

      reply.send({ success: true, result })
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })

  fastify.get('/books/:id', async (request, reply) => {
    try {
      const bookId = request.params.id
      const [rows] = await fastify.mysql.query(
        'SELECT * FROM books WHERE id = ?',
        [bookId]
      )

      if (rows.length === 0) {
        return reply.status(404).send({ error: 'Livro não encontrado' })
      }

      if (isNaN(Number(bookId))) {
        throw new Error('Id deve ser um número válido')
      }

      const query = `SELECT * FROM books WHERE id = ${bookId}`
      const [result] = await fastify.mysql.query(query)

      reply.send({ success: true, result })
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })

  fastify.post('/books', async (request, reply) => {
    const updatedYear = new Date()

    try {
      const { name, author, year } = await request.body

      if (year > updatedYear.getFullYear()) {
        throw new Error('Ano não pode ser maior que atual')
      }

      if (!name || !author || !year) {
        throw new Error('Dados obrigatórios não informados')
      }

      const query = 'INSERT INTO books (name, author, year) VALUES (?, ?, ?)'
      const [result] = await fastify.mysql.query(query, [name, author, year])

      reply.send({ success: true, result })
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })

  fastify.put('/books/:id', async (request, reply) => {
    const updatedYear = new Date()
    const bookId = request.params.id

    try {
      const { name, author, year } = await request.body

      if (year > updatedYear.getFullYear()) {
        throw new Error('Ano não pode ser maior que atual')
      }

      if (!name || !author || !year) {
        throw new Error('Dados obrigatórios não informados')
      }

      const query = `UPDATE books SET name = ?, author= ?, year = ? WHERE id = ${bookId}`
      const [result] = await fastify.mysql.query(query, [name, author, year])

      reply.send({ success: true, result })
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })

  fastify.delete('/books/:id', async (request, reply) => {
    try {
      const bookId = request.params.id
      const [rows] = await fastify.mysql.query(
        'SELECT * FROM books WHERE id = ?',
        [bookId]
      )

      if (isNaN(Number(bookId))) {
        throw new Error('Id deve ser um número válido')
      }

      if (rows.length === 0) {
        return reply.status(404).send({ error: 'Livro não encontrado' })
      }

      await fastify.mysql.query('DELETE FROM books WHERE id = ?', [bookId])

      return reply.status(204).send()
    } catch (error) {
      reply.status(400).send({ error: error.message })
    }
  })
}

module.exports = booksRoutes
