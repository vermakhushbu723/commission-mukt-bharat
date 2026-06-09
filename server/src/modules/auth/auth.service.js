import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import { env } from '../../config/env.js'
import { User } from '../../models/User.js'
import { Otp } from '../../models/Otp.js'
import { RefreshToken } from '../../models/RefreshToken.js'
import { sendOtp } from './otp.provider.js'
import { signAccessToken } from '../../utils/jwt.js'
import { badRequest, unauthorized, tooMany, conflict } from '../../utils/errors.js'

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex')

// --- OTP -------------------------------------------------------------------

export async function requestOtp(phone) {
  // Throttle per phone: at most 1 active challenge created per 60s.
  const recent = await Otp.findOne({ phone }).sort({ createdAt: -1 })
  if (recent && Date.now() - recent.createdAt.getTime() < 60_000) {
    throw tooMany('OTP recently sent — wait a minute before retrying', 'OTP_COOLDOWN')
  }

  const code =
    env.NODE_ENV === 'development' && env.SMS_PROVIDER === 'console'
      ? '123456' // predictable code in console/dev mode
      : String(crypto.randomInt(100000, 1000000))

  const codeHash = await bcrypt.hash(code, 10)
  const expiresAt = new Date(Date.now() + env.OTP_TTL_SECONDS * 1000)

  // Replace any prior challenge for this phone.
  await Otp.deleteMany({ phone })
  await Otp.create({ phone, codeHash, expiresAt })
  await sendOtp(phone, code)

  return { ttl: env.OTP_TTL_SECONDS }
}

export async function verifyOtp(phone, code) {
  const challenge = await Otp.findOne({ phone }).sort({ createdAt: -1 })
  if (!challenge) throw badRequest('No OTP requested for this number', 'OTP_NONE')
  if (challenge.expiresAt.getTime() < Date.now()) {
    await Otp.deleteMany({ phone })
    throw badRequest('OTP expired — request a new one', 'OTP_EXPIRED')
  }
  if (challenge.attempts >= env.OTP_MAX_ATTEMPTS) {
    await Otp.deleteMany({ phone })
    throw tooMany('Too many wrong attempts — request a new OTP', 'OTP_LOCKED')
  }

  const ok = await bcrypt.compare(code, challenge.codeHash)
  if (!ok) {
    challenge.attempts += 1
    await challenge.save()
    throw unauthorized('Incorrect OTP', 'OTP_WRONG')
  }

  await Otp.deleteMany({ phone })

  // Upsert the user — first successful verify creates the account.
  let user = await User.findOne({ phone })
  const isNewUser = !user
  if (!user) user = await User.create({ phone, verified: true })
  else if (!user.verified) {
    user.verified = true
    await user.save()
  }

  const tokens = await issueTokens(user)
  return { user, isNewUser, ...tokens }
}

// --- tokens ----------------------------------------------------------------

export async function issueTokens(user) {
  const accessToken = signAccessToken(user)
  const refreshToken = crypto.randomBytes(48).toString('hex')
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86_400_000)
  await RefreshToken.create({ user: user._id, tokenHash: sha256(refreshToken), expiresAt })
  return { accessToken, refreshToken }
}

export async function rotateRefreshToken(refreshToken) {
  if (!refreshToken) throw unauthorized('Refresh token required')
  const tokenHash = sha256(refreshToken)
  const stored = await RefreshToken.findOne({ tokenHash })
  if (!stored || stored.revokedAt || stored.expiresAt.getTime() < Date.now()) {
    throw unauthorized('Invalid or expired refresh token', 'REFRESH_INVALID')
  }
  // Rotate: revoke the old, issue a fresh pair.
  stored.revokedAt = new Date()
  await stored.save()

  const user = await User.findById(stored.user)
  if (!user) throw unauthorized('User no longer exists')
  const tokens = await issueTokens(user)
  return { user, ...tokens }
}

export async function revokeRefreshToken(refreshToken) {
  if (!refreshToken) return
  await RefreshToken.updateOne({ tokenHash: sha256(refreshToken) }, { revokedAt: new Date() })
}

// --- profile ---------------------------------------------------------------

export async function completeProfile(userId, { username, displayName, avatarUrl }) {
  const taken = await User.findOne({ username, _id: { $ne: userId } })
  if (taken) throw conflict('Username already taken', 'USERNAME_TAKEN')

  const user = await User.findByIdAndUpdate(
    userId,
    { username, displayName, ...(avatarUrl ? { avatarUrl } : {}) },
    { new: true },
  )
  if (!user) throw unauthorized('User not found')
  return user
}
