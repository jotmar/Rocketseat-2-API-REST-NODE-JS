import { app } from './app'
import { env } from './env/setup'

app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP Server is Running...')
    console.log(`Status: ${env.NODE_ENV}`)
  })
  .catch((err) => {
    console.log('ERROR! HTTP Server did not initialize ', +err)
  })
