const axios = require('axios')

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

  fastify.get('/books/details/:pokemon', async (request, reply) => {
    try {
      const pokemon = request.params.pokemon
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemon}`
      )

      if (!response.data.abilities || response.data.abilities.length === 0) {
        return reply
          .status(404)
          .send({ error: 'No abilities found for this Pokémon.' })
      }

      const abilityName = response.data.abilities[0].ability.name
      const [pokemonAbilities] = await fastify.mysql.query(
        'SELECT * FROM pokemon_abilities WHERE ability_name = ?',
        [abilityName]
      )

      if (pokemonAbilities.length === 0) {
        const query = `INSERT INTO pokemon_abilities (ability_name, ability_url, is_hidden, slot) VALUES (?, ?, ?, ?)`
        const [result] = await fastify.mysql.query(query, [
          abilityName,
          response.data.abilities[0].ability.url,
          response.data.abilities[0].is_hidden,
          response.data.abilities[0].slot,
        ])

        return reply.send({ success: true, result })
      }

      return reply.send({ success: true, abilities: pokemonAbilities })
    } catch (error) {
      return reply.status(400).send({ error: error.message })
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
