// Lightweight typed HTTP error used across the app. Thrown anywhere, caught by
// the central error middleware which maps it to { error: { message, code } }.
export class HttpError extends Error {
  constructor(status, message, code) {
    super(message)
    this.status = status
    this.code = code || undefined
  }
}

export const badRequest = (msg, code) => new HttpError(400, msg, code)
export const unauthorized = (msg = 'Unauthorized', code) => new HttpError(401, msg, code)
export const forbidden = (msg = 'Forbidden', code) => new HttpError(403, msg, code)
export const notFound = (msg = 'Not found', code) => new HttpError(404, msg, code)
export const tooMany = (msg = 'Too many requests', code) => new HttpError(429, msg, code)
export const conflict = (msg, code) => new HttpError(409, msg, code)
