import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionId } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: checkSessionId,
    },
    async (request) => {
      /* Validação com cookies */
      const { sessionId } = request.cookies

      /* Retorno de todas as transações */
      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select('*')
      return { transactions }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: checkSessionId,
    },
    async (request) => {
      /* Transação única */

      const { sessionId } = request.cookies

      const getRequestParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getRequestParamsSchema.parse(request.params)

      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { transaction }
    },
  )

  app.get(
    '/summary',
    {
      preHandler: checkSessionId,
    },
    async (request) => {
      /* Resumo do valor da conta */

      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where('session_id', sessionId)
        .sum('amount', { as: 'amount' })
        .first()
      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    /* Criando um schema para os dados que serão recebidos do body */

    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    /* Atribuindo os dados para variáveis que serão enviadas para o banco de dados */

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    /* Setup dos cookies de sessão */

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.cookie('sessionId', sessionId, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    /* Enviando dados para o banco de dados */

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })
    return reply.status(201).send()
  })
}
