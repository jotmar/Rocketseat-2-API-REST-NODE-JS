import fastify from 'fastify'
import { knex } from './database'
import { randomUUID } from 'node:crypto'

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
    port: 3333,
  })
  .then(() => {
    console.log('HTTP Server is Running...')
  })
  .catch((err) => {
    console.log('ERROR! HTTP Server did not initialize ', +err)
  })
