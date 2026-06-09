import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { connectMongo } from './db/mongo.js'
import { createApp } from './app.js'

async function start() {
  await connectMongo()
  const app = createApp()
  app.listen(env.PORT, () => logger.info(`🚀 API listening on http://localhost:${env.PORT}`))
}

start().catch((err) => {
  logger.error({ err }, 'Failed to start server')
  process.exit(1)
})
