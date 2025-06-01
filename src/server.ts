import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'
import { env } from './env/setup'

const app = fastify()

app.get('/hello', async () => {
  const transactions = await knex('transactions')
    .insert({
      id: randomUUID(),
      title: 'Testing Queries',
      amount: 1000,
    })
    .returning('*')
  return transactions
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server is Running...')
    console.log(`Status: ${env.NODE_ENV}`)
  })
  .catch((err) => {
    console.log('ERROR! HTTP Server did not initialize ', +err)
  })
