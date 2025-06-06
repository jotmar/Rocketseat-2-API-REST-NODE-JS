import { app } from './app'
import { env } from './env/setup'

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
