const jwt = require('jsonwebtoken')

function verifyJWT(request, reply) {
  const authorization = request.headers.authorization

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return reply
      .code(401)
      .send({ message: 'Missing or invalid authorization header' })
  }

  const token = authorization.split(' ')[1]

  try {
    const decoded = jwt.verify(token, 'sua_chave_secreta')
    request.user = decoded
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return reply.code(401).send({ message: 'Invalid token' })
    } else {
      return reply.code(500).send({ message: 'Internal server error' })
    }
  }
}

module.exports = verifyJWT
