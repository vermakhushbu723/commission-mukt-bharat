import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), role: user.role, username: user.username },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_TTL },
  )
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET)
}

// Refresh tokens are opaque random strings (not JWTs) so they can be revoked
// server-side. We only sign/verify the short-lived access token as a JWT.
