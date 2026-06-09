import mongoose from 'mongoose'
import { env } from '../config/env.js'
import { logger } from '../config/logger.js'

export async function connectMongo() {
  mongoose.set('strictQuery', true)
  await mongoose.connect(env.MONGODB_URI)
  logger.info('✅ MongoDB connected')

  mongoose.connection.on('error', (err) => logger.error({ err }, 'MongoDB error'))
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))
}
