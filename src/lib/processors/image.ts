import sharp from 'sharp'
import type { ProcessResult } from './index'

interface FileInput {
  name: string
  data: Buffer
  type: string
}

type ProgressCallback = (progress: number) => Promise<void>

export async function processImage(
  toolName: string,
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  try {
    switch (toolName) {
      case 'convert-image':
        return await convertImage(files, options, onProgress)

      case 'compress-image':
        return await compressImage(files, options, onProgress)

      case 'resize-image':
        return await resizeImage(files, options, onProgress)

      case 'crop-image':
        return await cropImage(files[0], options, onProgress)

      case 'rotate-flip-image':
        return await rotateFlipImage(files, options, onProgress)

      case 'remove-exif':
        return await removeExif(files, onProgress)

      case 'watermark-image':
        return await watermarkImage(files, options, onProgress)

      default:
        return {
          success: false,
          outputs: [],
          error: 'هذه الأداة غير متوفرة حالياً'
        }
    }
  } catch (error) {
    console.error('Image processing error:', error)
    return {
      success: false,
      outputs: [],
      error: error instanceof Error ? error.message : 'فشل في معالجة الصورة'
    }
  }
}

async function convertImage(
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const format = (options.format as string) || 'png'
  const outputs: ProcessResult['outputs'] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    let processor = sharp(file.data)

    const baseName = file.name.replace(/\.[^/.]+$/, '')
    let mimeType = 'image/png'
    let outputName = `${baseName}.png`

    switch (format) {
      case 'jpeg':
      case 'jpg':
        processor = processor.jpeg({ quality: 90 })
        mimeType = 'image/jpeg'
        outputName = `${baseName}.jpg`
        break
      case 'webp':
        processor = processor.webp({ quality: 90 })
        mimeType = 'image/webp'
        outputName = `${baseName}.webp`
        break
      case 'avif':
        processor = processor.avif({ quality: 80 })
        mimeType = 'image/avif'
        outputName = `${baseName}.avif`
        break
      case 'gif':
        processor = processor.gif()
        mimeType = 'image/gif'
        outputName = `${baseName}.gif`
        break
      case 'tiff':
        processor = processor.tiff()
        mimeType = 'image/tiff'
        outputName = `${baseName}.tiff`
        break
      default:
        processor = processor.png()
    }

    const outputBuffer = await processor.toBuffer()
    outputs.push({
      name: outputName,
      data: outputBuffer,
      mimeType
    })

    await onProgress(30 + Math.floor((i / files.length) * 50))
  }

  return { success: true, outputs }
}

async function compressImage(
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const quality = (options.quality as number) || 80
  const outputs: ProcessResult['outputs'] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const metadata = await sharp(file.data).metadata()

    let processor = sharp(file.data)
    let mimeType = file.type

    switch (metadata.format) {
      case 'jpeg':
        processor = processor.jpeg({ quality, mozjpeg: true })
        break
      case 'png':
        processor = processor.png({ compressionLevel: 9, quality })
        break
      case 'webp':
        processor = processor.webp({ quality })
        break
      default:
        processor = processor.jpeg({ quality, mozjpeg: true })
        mimeType = 'image/jpeg'
    }

    const outputBuffer = await processor.toBuffer()
    outputs.push({
      name: `compressed-${file.name}`,
      data: outputBuffer,
      mimeType
    })

    await onProgress(30 + Math.floor((i / files.length) * 50))
  }

  return { success: true, outputs }
}

async function resizeImage(
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const width = options.width as number | undefined
  const height = options.height as number | undefined
  const fit = (options.fit as 'cover' | 'contain' | 'fill' | 'inside' | 'outside') || 'inside'

  const outputs: ProcessResult['outputs'] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const metadata = await sharp(file.data).metadata()

    const outputBuffer = await sharp(file.data)
      .resize(width, height, { fit, withoutEnlargement: true })
      .toBuffer()

    outputs.push({
      name: `resized-${file.name}`,
      data: outputBuffer,
      mimeType: file.type || `image/${metadata.format}`
    })

    await onProgress(30 + Math.floor((i / files.length) * 50))
  }

  return { success: true, outputs }
}

async function cropImage(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const left = (options.left as number) || 0
  const top = (options.top as number) || 0
  const width = options.width as number
  const height = options.height as number

  if (!width || !height) {
    return {
      success: false,
      outputs: [],
      error: 'يرجى تحديد أبعاد القص'
    }
  }

  await onProgress(40)

  const metadata = await sharp(file.data).metadata()
  const outputBuffer = await sharp(file.data)
    .extract({ left, top, width, height })
    .toBuffer()

  return {
    success: true,
    outputs: [{
      name: `cropped-${file.name}`,
      data: outputBuffer,
      mimeType: file.type || `image/${metadata.format}`
    }]
  }
}

async function rotateFlipImage(
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const rotation = (options.rotation as number) || 0
  const flipH = options.flipHorizontal as boolean
  const flipV = options.flipVertical as boolean

  const outputs: ProcessResult['outputs'] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const metadata = await sharp(file.data).metadata()

    let processor = sharp(file.data)

    if (rotation) {
      processor = processor.rotate(rotation)
    }
    if (flipH) {
      processor = processor.flop()
    }
    if (flipV) {
      processor = processor.flip()
    }

    const outputBuffer = await processor.toBuffer()
    outputs.push({
      name: `edited-${file.name}`,
      data: outputBuffer,
      mimeType: file.type || `image/${metadata.format}`
    })

    await onProgress(30 + Math.floor((i / files.length) * 50))
  }

  return { success: true, outputs }
}

async function removeExif(
  files: FileInput[],
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const outputs: ProcessResult['outputs'] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const metadata = await sharp(file.data).metadata()

    // Re-encode to strip metadata
    const outputBuffer = await sharp(file.data)
      .rotate() // Auto-rotate based on EXIF, then strip
      .toBuffer()

    outputs.push({
      name: `no-exif-${file.name}`,
      data: outputBuffer,
      mimeType: file.type || `image/${metadata.format}`
    })

    await onProgress(30 + Math.floor((i / files.length) * 50))
  }

  return { success: true, outputs }
}

async function watermarkImage(
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const text = (options.text as string) || 'Watermark'
  const outputs: ProcessResult['outputs'] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const metadata = await sharp(file.data).metadata()
    const width = metadata.width || 800
    const height = metadata.height || 600

    // Create SVG watermark
    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          .watermark {
            fill: rgba(255,255,255,0.5);
            font-size: ${Math.min(width, height) / 10}px;
            font-family: Arial, sans-serif;
          }
        </style>
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dominant-baseline="middle"
          class="watermark"
          transform="rotate(-30 ${width/2} ${height/2})"
        >${text}</text>
      </svg>
    `

    const outputBuffer = await sharp(file.data)
      .composite([{
        input: Buffer.from(svgText),
        gravity: 'center'
      }])
      .toBuffer()

    outputs.push({
      name: `watermarked-${file.name}`,
      data: outputBuffer,
      mimeType: file.type || `image/${metadata.format}`
    })

    await onProgress(30 + Math.floor((i / files.length) * 50))
  }

  return { success: true, outputs }
}
