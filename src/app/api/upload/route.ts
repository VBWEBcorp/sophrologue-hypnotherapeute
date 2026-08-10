import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { r2Enabled, r2Mode, uploadToR2 } from '@/lib/r2'
import { optimizeImage } from '@/lib/optimize-image'

export async function POST(request: NextRequest) {
  try {
    const { authenticated, user } = await verifyAuth(request)
    if (!authenticated || user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Vérifier le type. Le SVG est volontairement exclu : il peut embarquer du
    // script et il n'est pas ré-encodé par Sharp, donc il serait stocké tel quel.
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format non accepté. Formats acceptés : JPG, PNG, WebP, GIF.' },
        { status: 400 }
      )
    }

    // Vérifier la taille (10MB max avant optimisation)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer())
    const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Optimiser avec Sharp → WebP. Sharp échoue si le contenu n'est pas une
    // vraie image (type MIME menteur) : on répond alors 400, pas 500.
    let finalBuffer: Buffer
    let contentType: string
    let filename: string

    try {
      const optimized = await optimizeImage(rawBuffer)
      finalBuffer = optimized.buffer
      contentType = optimized.contentType
      filename = `${uniqueId}.${optimized.ext}`
    } catch {
      return NextResponse.json(
        { error: "Ce fichier n'est pas une image valide." },
        { status: 400 }
      )
    }

    let url: string

    if (r2Enabled) {
      // Upload vers Cloudflare R2
      url = await uploadToR2(finalBuffer, filename, contentType)
    } else {
      // Fallback: stockage local
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      await writeFile(path.join(uploadsDir, filename), finalBuffer)
      url = `/uploads/${filename}`
    }

    // Taille avant/après
    const originalSize = (rawBuffer.length / 1024).toFixed(1)
    const optimizedSize = (finalBuffer.length / 1024).toFixed(1)

    return NextResponse.json({
      url,
      filename,
      originalSize: `${originalSize} Ko`,
      optimizedSize: `${optimizedSize} Ko`,
      storage: r2Enabled ? `cloudflare-r2 (${r2Mode})` : 'local',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
