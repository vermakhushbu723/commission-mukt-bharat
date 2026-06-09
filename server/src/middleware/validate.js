import { badRequest } from '../utils/errors.js'

// Validates req[source] against a zod schema and replaces it with the parsed
// (coerced/defaulted) value. Throws 400 with field errors on failure.
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source])
  if (!result.success) {
    const err = badRequest('Validation failed', 'VALIDATION')
    err.details = result.error.flatten().fieldErrors
    return next(err)
  }
  req[source] = result.data
  next()
}
