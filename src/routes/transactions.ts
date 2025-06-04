import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const transactions = await knex('transactions').select('*')
    return { transactions }
  })

  app.get('/:id', async (request) => {
    const getRequestParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getRequestParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

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

    /* Enviando dados para o banco de dados */

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })
    return reply.status(201).send()
  })
}
