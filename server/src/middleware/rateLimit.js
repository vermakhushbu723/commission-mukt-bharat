import rateLimit from 'express-rate-limit'

const json = (req, res) =>
  res.status(429).json({ error: { message: 'Too many requests, slow down', code: 'RATE_LIMIT' } })

// OTP request: cheap to spam, expensive (SMS cost) to serve. Lock it down hard
// per IP. Per-phone throttling is enforced separately in the auth service.
export const otpRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1h
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json,
})

export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json,
})

// General write limiter for posts/comments/likes.
export const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json,
})
