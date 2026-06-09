import { env } from '../../config/env.js'
import { logger } from '../../config/logger.js'

// Pluggable OTP sender. Swap providers via SMS_PROVIDER env. Each provider
// implements sendOtp(phone, code) -> Promise<void>.

async function consoleProvider(phone, code) {
  logger.info({ phone, code }, '📲 [console SMS] OTP code (dev only — no SMS sent)')
}

// MSG91 OTP flow API. Requires an approved DLT template whose variable holds the
// code. Docs: https://docs.msg91.com/otp
async function msg91Provider(phone, code) {
  if (!env.MSG91_AUTH_KEY || !env.MSG91_TEMPLATE_ID) {
    throw new Error('MSG91_AUTH_KEY and MSG91_TEMPLATE_ID are required when SMS_PROVIDER=msg91')
  }
  // MSG91 expects the mobile with country code, digits only (e.g. 91XXXXXXXXXX).
  const mobile = phone.replace(/[^\d]/g, '')
  const res = await fetch('https://control.msg91.com/api/v5/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authkey: env.MSG91_AUTH_KEY },
    body: JSON.stringify({
      template_id: env.MSG91_TEMPLATE_ID,
      mobile,
      otp: code,
      ...(env.MSG91_SENDER_ID ? { sender: env.MSG91_SENDER_ID } : {}),
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`MSG91 send failed (${res.status}): ${text}`)
  }
}

const providers = { console: consoleProvider, msg91: msg91Provider }

export function sendOtp(phone, code) {
  const provider = providers[env.SMS_PROVIDER] || consoleProvider
  return provider(phone, code)
}
