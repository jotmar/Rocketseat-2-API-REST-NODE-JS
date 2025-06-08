import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'
import { z } from 'zod'

describe('Transactions Route', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
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

  it('should be possible to list a single transaction.', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Single Transaction',
        amount: 3500,
        type: 'credit',
      })
      .expect(201)

    const cookieSchema = z.array(z.string())

    const cookie = cookieSchema.parse(
      createTransactionResponse.get('Set-Cookie'),
    )

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie)
      .expect(200)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'Single Transaction',
        amount: 3500,
      }),
    ])

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const listSingleTransactionResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookie)
      .expect(200)

    expect(listSingleTransactionResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Single Transaction',
        amount: 3500,
      }),
    )
  })

  it('should be possible to get the user summary.', async () => {
    let createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Get Summary',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)

    const cookieSchema = z.array(z.string())

    const cookie = cookieSchema.parse(
      createTransactionResponse.get('Set-Cookie'),
    )

    createTransactionResponse = await request(app.server)
      .post('/transactions')
      .set('Cookie', cookie)
      .send({
        title: 'Get Summary 2',
        amount: 2000,
        type: 'debit',
      })
      .expect(201)

    const getSummaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie)
      .expect(200)

    expect(getSummaryResponse.body.summary).toEqual(
      expect.objectContaining({
        amount: 3000,
      }),
    )
  })
})
