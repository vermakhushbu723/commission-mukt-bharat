import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../../config/env.js'

let _client = null
function client() {
  if (!_client) {
    _client = new S3Client({
      region: env.AWS_REGION,
      credentials:
        env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
          ? { accessKeyId: env.AWS_ACCESS_KEY_ID, secretAccessKey: env.AWS_SECRET_ACCESS_KEY }
          : undefined, // fall back to instance role / shared config
    })
  }
  return _client
}

// Public URL the object will be reachable at after upload.
export function publicUrl(key) {
  const base = env.S3_PUBLIC_BASE_URL || `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com`
  return `${base.replace(/\/$/, '')}/${key}`
}

// Presigned PUT — client uploads the file body directly to S3. The signature is
// bound to the exact content-type so the client can't swap it after signing.
export async function presignPut({ key, contentType, expiresIn = 300 }) {
  const cmd = new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, ContentType: contentType })
  const uploadUrl = await getSignedUrl(client(), cmd, { expiresIn })
  return { uploadUrl, url: publicUrl(key) }
}
