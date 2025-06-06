import fastify from 'fastify'
import { transactionsRoutes } from './routes/transactions'
import cookie from '@fastify/cookie'
// import type { FastifyCookieOptions } from '@fastify/cookie'

export const app = fastify()

app.addHook('preHandler', async (request) => {
  console.log(`[${request.method}] ${request.url}`)
})

app.register(cookie)

app.register(transactionsRoutes, {
  prefix: 'transactions',
})
