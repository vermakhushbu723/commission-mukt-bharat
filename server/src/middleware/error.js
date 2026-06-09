import { logger } from '../config/logger.js'
import { HttpError } from '../utils/errors.js'

// eslint-disable-next-line no-unused-vars -- express needs 4 args to detect error mw
export function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { message: err.message, code: err.code, details: err.details },
    })
  }
  // Mongo duplicate key
  if (err?.code === 11000) {
    return res.status(409).json({ error: { message: 'Already exists', code: 'DUPLICATE' } })
  }
  logger.error({ err }, 'Unhandled error')
  res.status(500).json({ error: { message: 'Internal server error' } })
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: { message: 'Route not found' } })
}
