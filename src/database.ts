import { knex as setupKnex, Knex } from 'knex'
import { env } from './env/setup'

const dbConnection =
  env.DATABASE_CLIENT === 'sqlite3'
    ? {
        filename: env.DATABASE_URL,
      }
    : env.DATABASE_URL

export const config: Knex.Config = {
  client: 'sqlite',
  connection: dbConnection,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
