import { z } from 'zod'
import { nanoid } from 'nanoid'
import { presignPut } from './s3.js'
import { badRequest } from '../../utils/errors.js'

// Allowed content types + per-type size caps (bytes).
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
const MAX_IMAGE = 8 * 1024 * 1024 // 8 MB
const MAX_VIDEO = 100 * 1024 * 1024 // 100 MB

export const presignSchema = z.object({
  type: z.enum(['image', 'video']),
  contentType: z.string().min(3),
  size: z.coerce.number().int().positive(),
})

const EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
}

export async function presign(req, res) {
  const { type, contentType, size } = req.body
  const allowed = type === 'image' ? IMAGE_TYPES : VIDEO_TYPES
  const maxSize = type === 'image' ? MAX_IMAGE : MAX_VIDEO

  if (!allowed.includes(contentType)) {
    throw badRequest(`Unsupported ${type} content-type: ${contentType}`, 'BAD_CONTENT_TYPE')
  }
  if (size > maxSize) {
    throw badRequest(`File too large — max ${Math.round(maxSize / 1024 / 1024)} MB for ${type}`, 'FILE_TOO_LARGE')
  }

  const key = `posts/${req.user.id}/${nanoid()}.${EXT[contentType] || 'bin'}`
  const { uploadUrl, url } = await presignPut({ key, contentType })

  res.json({ uploadUrl, key, url, type })
}
