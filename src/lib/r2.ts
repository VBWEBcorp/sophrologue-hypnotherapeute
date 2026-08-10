/**
 * r2.ts — envoi des médias vers Cloudflare R2 (bucket « veronique-jan »).
 *
 * Deux voies possibles, essayées dans cet ordre :
 *
 *  1. Protocole S3 — nécessite un Access Key ID + Secret Access Key créés dans
 *     « R2 → API → Manage API tokens ». C'est la voie standard.
 *  2. API REST Cloudflare — n'a besoin que du token de compte
 *     CLOUDFLARE_API_TOKEN. Elle évite d'avoir à créer des clés S3 et couvre
 *     exactement notre usage (déposer et supprimer un objet).
 *
 * Sans aucune des deux, `r2Enabled` vaut false et /api/upload retombe sur le
 * disque local — ce qui ne fonctionne PAS en production (hébergement
 * serverless : le système de fichiers n'est pas inscriptible).
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const BUCKET_NAME = process.env.R2_BUCKET_NAME
const PUBLIC_URL = process.env.R2_PUBLIC_URL
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

/** Les médias déposés depuis l'admin vivent sous ce préfixe. */
const KEY_PREFIX = 'uploads'

const s3Ready = Boolean(ACCOUNT_ID && BUCKET_NAME && ACCESS_KEY_ID && SECRET_ACCESS_KEY)
const restReady = Boolean(ACCOUNT_ID && BUCKET_NAME && API_TOKEN)

export const r2Enabled = Boolean(PUBLIC_URL && (s3Ready || restReady))

/** Voie réellement utilisée — reprise dans la réponse de /api/upload. */
export const r2Mode: 's3' | 'api' | null = s3Ready ? 's3' : restReady ? 'api' : null

const s3Client = s3Ready
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: ACCESS_KEY_ID as string,
        secretAccessKey: SECRET_ACCESS_KEY as string,
      },
    })
  : null

const objectsEndpoint = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET_NAME}/objects`

/** URL publique d'un objet du bucket. */
export function publicUrl(key: string): string {
  return `${(PUBLIC_URL as string).replace(/\/$/, '')}/${key}`
}

export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const key = `${KEY_PREFIX}/${filename}`

  if (s3Client) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )
    return publicUrl(key)
  }

  if (restReady) {
    const response = await fetch(`${objectsEndpoint}/${key}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': contentType,
      },
      body: new Uint8Array(buffer),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(`R2 upload failed (${response.status}): ${detail.slice(0, 300)}`)
    }
    return publicUrl(key)
  }

  throw new Error('R2 is not configured')
}

export async function deleteFromR2(key: string): Promise<void> {
  // Accepte une clé (« uploads/xxx.webp ») ou une URL publique complète.
  const objectKey = key.startsWith('http')
    ? key.replace(`${(PUBLIC_URL as string).replace(/\/$/, '')}/`, '')
    : key

  if (s3Client) {
    await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: objectKey }))
    return
  }

  if (restReady) {
    await fetch(`${objectsEndpoint}/${objectKey}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    })
  }
}
