import { verifyAccessToken } from '../utils/jwt.js'
import { unauthorized, forbidden } from '../utils/errors.js'

// Parses the Bearer access token. `required` middleware rejects when absent;
// `optional` attaches req.user when present but never blocks (used for feeds
// where logged-out users can still read).
function parse(req) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) return null
  try {
    const payload = verifyAccessToken(token)
    return { id: payload.sub, role: payload.role, username: payload.username }
  } catch {
    return null
  }
}

export function requireAuth(req, _res, next) {
  const user = parse(req)
  if (!user) return next(unauthorized('Valid access token required'))
  req.user = user
  next()
}

export function optionalAuth(req, _res, next) {
  req.user = parse(req) || null
  next()
}

export function requireAdmin(req, _res, next) {
  if (!req.user) return next(unauthorized())
  if (req.user.role !== 'admin') return next(forbidden('Admin only'))
  next()
}
