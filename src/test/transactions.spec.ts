import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { z } from 'zod'

describe('Transactions Route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be possible to create a new transaction.', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Testing Title',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be possible to list all transactions.', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Testing Title',
        amount: 5000,
        type: 'debit',
      })

    const cookiesSchema = z.array(z.string())

    const cookie = cookiesSchema.parse(
      createTransactionResponse.get('Set-Cookie'),
    )

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Testing Title',
        amount: -5000,
      }),
    ])
  })
})
