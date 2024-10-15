const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

async function loginRoutes(fastify, options) {
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body

    try {
      const [results] = await fastify.mysql.query(
        'SELECT * FROM users WHERE username = ?',
        [username]
      )

      const user = results[0]

      if (!user) {
        return reply.code(401).send({ message: 'Usuário ou senha incorreto' })
      }

      const isMatch = await bcrypt.compare(password, user.password_hash)

      if (!isMatch) {
        return reply.code(401).send({ message: 'Usuário ou senha incorreto' })
      }

      const token = jwt.sign({ id: user.id }, 'sua_chave_secreta', {
        expiresIn: '1h',
      })

      reply.send({ token })
    } catch (error) {
      reply.code(500).send({ message: 'Erro ao realizar o login' })
    }
  })

  fastify.post('/register', async (request, reply) => {
    const { username, password } = request.body

    try {
      const hashedPassword = await bcrypt.hash(password, 10)

      await fastify.mysql.query(
        'INSERT INTO users (username, password_hash) VALUES (?, ?)',
        [username, hashedPassword]
      )

      reply.send({ message: 'Usuário criado com sucesso' })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        reply.code(409).send({ message: 'Usuário já existe' })
      } else {
        reply.code(500).send({ message: 'Erro ao criar usuário' })
      }
    }
  })
}

module.exports = loginRoutes
