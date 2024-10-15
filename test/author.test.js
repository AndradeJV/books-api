const fastify = require('fastify')()
const request = require('supertest')
const authorsRouter = require('../src/routes/authorsRouter')
require('dotenv').config()

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_DATABASE
const host = process.env.DB_HOST

fastify.register(require('@fastify/mysql'), {
  promise: true,
  connectionString: `mysql://${user}:${password}@${host}:3306/${database}`,
})

fastify.register(authorsRouter)

describe('Author Router Tests', () => {
  beforeAll(async () => {
    await fastify.ready()
  })

  afterAll(async () => {
    await fastify.close()
  })

  it('should return 200 status for GET /authors', async () => {
    const response = await request(fastify.server).get('/authors')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.any(Object))
    expect(response.body.authors[0]).toHaveProperty('id')
    expect(response.body.authors[0]).toHaveProperty('name')
    expect(response.body.authors[0]).toHaveProperty('biography')
  })

  it('should return 200 status for GET /authors/:id', async () => {
    const response = await request(fastify.server).get('/authors/1')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.any(Object))
    expect(response.body.author[0]).toHaveProperty('id')
    expect(response.body.author[0]).toHaveProperty('name')
    expect(response.body.author[0]).toHaveProperty('biography')
  })
})
