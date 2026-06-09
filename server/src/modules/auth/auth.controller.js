import { z } from 'zod'
import * as auth from './auth.service.js'
import { User } from '../../models/User.js'
import { serializeUser } from '../../utils/serialize.js'
import { unauthorized } from '../../utils/errors.js'

// E.164-ish phone: optional +, country code, 8-15 digits.
const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+?[1-9]\d{7,14}$/, 'Enter a valid phone number with country code')

export const requestOtpSchema = z.object({ phone: phoneSchema })
export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().trim().regex(/^\d{6}$/, 'OTP must be 6 digits'),
})
export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers and underscore only'),
  displayName: z.string().trim().min(1).max(60),
  avatarUrl: z.string().url().optional(),
})
export const refreshSchema = z.object({ refreshToken: z.string().min(10) })

export async function requestOtp(req, res) {
  const out = await auth.requestOtp(req.body.phone)
  res.json({ ok: true, ...out })
}

export async function verifyOtp(req, res) {
  const { user, isNewUser, accessToken, refreshToken } = await auth.verifyOtp(
    req.body.phone,
    req.body.code,
  )
  res.json({ user: serializeUser(user), isNewUser, accessToken, refreshToken })
}

export async function refresh(req, res) {
  const { user, accessToken, refreshToken } = await auth.rotateRefreshToken(req.body.refreshToken)
  res.json({ user: serializeUser(user), accessToken, refreshToken })
}

export async function logout(req, res) {
  await auth.revokeRefreshToken(req.body?.refreshToken)
  res.json({ ok: true })
}

export async function updateProfile(req, res) {
  const user = await auth.completeProfile(req.user.id, req.body)
  res.json({ user: serializeUser(user) })
}

export async function me(req, res) {
  const user = await User.findById(req.user.id)
  if (!user) throw unauthorized('User not found')
  res.json({ user: serializeUser(user) })
}
