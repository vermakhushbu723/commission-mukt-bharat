import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import pinoHttp from 'pino-http'
import swaggerUi from 'swagger-ui-express'
import { logger } from './config/logger.js'
import { allowedOrigins } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/error.js'
import { openapiSpec } from './docs/openapi.js'

import authRoutes from './modules/auth/auth.routes.js'
import postRoutes from './modules/posts/posts.routes.js'
import commentRoutes from './modules/comments/comments.routes.js'
import mediaRoutes from './modules/media/media.routes.js'

export function createApp() {
  const app = express()

  // CSP off: this is a JSON API; the only HTML served is swagger-ui, whose
  // inline assets helmet's default CSP would otherwise block.
  app.use(helmet({ contentSecurityPolicy: false }))
  app.use(
    cors({
      origin(origin, cb) {
        // allow same-origin / curl (no origin) and whitelisted client origins
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
        cb(new Error(`Origin not allowed: ${origin}`))
      },
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(pinoHttp({ logger }))

  app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }))

  // API docs — interactive UI at /docs, raw OpenAPI JSON at /docs.json.
  app.get('/docs.json', (_req, res) => res.json(openapiSpec))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, { customSiteTitle: 'CMB API Docs' }))

  app.use('/auth', authRoutes)
  app.use('/posts', postRoutes)
  app.use('/comments', commentRoutes)
  app.use('/media', mediaRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
