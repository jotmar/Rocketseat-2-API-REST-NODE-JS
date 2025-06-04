import fastify from 'fastify'
import { env } from './env/setup'
import { transactionsRoutes } from './routes/transactions'

const app = fastify()

app.register(transactionsRoutes, {
  prefix: 'transactions',
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
