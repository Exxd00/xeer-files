import archiver from 'archiver'
import unzipper from 'unzipper'
import { Readable, Writable } from 'stream'
import type { ProcessResult } from './index'

interface FileInput {
  name: string
  data: Buffer
  type: string
}

type ProgressCallback = (progress: number) => Promise<void>

export async function processArchive(
  toolName: string,
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  try {
    switch (toolName) {
      case 'zip-create':
        return await createZip(files, onProgress)

      case 'zip-extract':
        return await extractZip(files[0], onProgress)

      case 'tar-gz-create':
        return await createTarGz(files, onProgress)

      default:
        return {
          success: false,
          outputs: [],
          error: 'هذه الأداة غير متوفرة حالياً'
        }
    }
  } catch (error) {
    console.error('Archive processing error:', error)
    return {
      success: false,
      outputs: [],
      error: error instanceof Error ? error.message : 'فشل في معالجة الأرشيف'
    }
  }
}

async function createZip(
  files: FileInput[],
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []

    const archive = archiver('zip', {
      zlib: { level: 9 }
    })

    const output = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk)
        callback()
      }
    })

    output.on('finish', () => {
      resolve({
        success: true,
        outputs: [{
          name: 'archive.zip',
          data: Buffer.concat(chunks),
          mimeType: 'application/zip'
        }]
      })
    })

    archive.on('error', (err) => {
      resolve({
        success: false,
        outputs: [],
        error: err.message
      })
    })

    archive.pipe(output)

    // Add files to archive
    files.forEach((file, index) => {
      archive.append(file.data, { name: file.name })
    })

    onProgress(70).then(() => archive.finalize())
  })
}

async function extractZip(
  file: FileInput,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const outputs: ProcessResult['outputs'] = []

  const directory = await unzipper.Open.buffer(file.data)

  await onProgress(40)

  for (const entry of directory.files) {
    if (entry.type === 'File') {
      const content = await entry.buffer()
      outputs.push({
        name: entry.path,
        data: content,
        mimeType: 'application/octet-stream'
      })
    }
  }

  await onProgress(80)

  // If multiple files, create a new zip with extracted contents
  // For simplicity, return individual files if <= 5, else rezip
  if (outputs.length <= 5) {
    return { success: true, outputs }
  }

  // Create a new zip with all extracted files
  return new Promise((resolve) => {
    const chunks: Buffer[] = []

    const archive = archiver('zip', {
      zlib: { level: 9 }
    })

    const output = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk)
        callback()
      }
    })

    output.on('finish', () => {
      resolve({
        success: true,
        outputs: [{
          name: 'extracted.zip',
          data: Buffer.concat(chunks),
          mimeType: 'application/zip'
        }]
      })
    })

    archive.pipe(output)

    outputs.forEach((f) => {
      archive.append(f.data, { name: f.name })
    })

    archive.finalize()
  })
}

async function createTarGz(
  files: FileInput[],
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []

    const archive = archiver('tar', {
      gzip: true,
      gzipOptions: { level: 9 }
    })

    const output = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk)
        callback()
      }
    })

    output.on('finish', () => {
      resolve({
        success: true,
        outputs: [{
          name: 'archive.tar.gz',
          data: Buffer.concat(chunks),
          mimeType: 'application/gzip'
        }]
      })
    })

    archive.on('error', (err) => {
      resolve({
        success: false,
        outputs: [],
        error: err.message
      })
    })

    archive.pipe(output)

    files.forEach((file) => {
      archive.append(file.data, { name: file.name })
    })

    onProgress(70).then(() => archive.finalize())
  })
}
