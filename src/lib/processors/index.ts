import { createAnonClient } from '@/lib/supabase/server'
import { processPdf } from './pdf'
import { processImage } from './image'
import { processArchive } from './archive'
import { processText } from './text'

export interface ProcessResult {
  success: boolean
  outputs: {
    name: string
    data: Buffer
    mimeType: string
  }[]
  error?: string
}

export interface InputFile {
  name: string
  path: string
  size: number
}

type ProgressCallback = (progress: number) => Promise<void>

export async function processJob(
  toolName: string,
  inputFiles: InputFile[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const supabase = createAnonClient()

  try {
    // Download input files
    const files: { name: string; data: Buffer; type: string }[] = []

    for (const inputFile of inputFiles) {
      const { data, error } = await supabase.storage
        .from('uploads')
        .download(inputFile.path)

      if (error || !data) {
        throw new Error(`Failed to download file: ${inputFile.name}`)
      }

      const arrayBuffer = await data.arrayBuffer()
      files.push({
        name: inputFile.name,
        data: Buffer.from(arrayBuffer),
        type: data.type
      })
    }

    await onProgress(20)

    // Route to appropriate processor
    const category = getToolCategory(toolName)

    let result: ProcessResult

    switch (category) {
      case 'pdf':
        result = await processPdf(toolName, files, options, onProgress)
        break
      case 'images':
        result = await processImage(toolName, files, options, onProgress)
        break
      case 'archive':
        result = await processArchive(toolName, files, options, onProgress)
        break
      case 'text':
      case 'extras':
        result = await processText(toolName, files, options, onProgress)
        break
      default:
        result = {
          success: false,
          outputs: [],
          error: 'نوع الأداة غير مدعوم بعد'
        }
    }

    await onProgress(90)
    return result

  } catch (error) {
    console.error('Process job error:', error)
    return {
      success: false,
      outputs: [],
      error: error instanceof Error ? error.message : 'حدث خطأ أثناء المعالجة'
    }
  }
}

function getToolCategory(toolName: string): string {
  const pdfTools = [
    'compress-pdf', 'merge-pdf', 'split-pdf', 'extract-pages', 'delete-pages',
    'reorder-pages', 'rotate-pages', 'pdf-to-jpg', 'jpg-to-pdf', 'pdf-to-word',
    'word-to-pdf', 'add-watermark', 'add-page-numbers', 'protect-pdf', 'unlock-pdf',
    'remove-metadata', 'crop-pdf', 'resize-pages', 'flatten-pdf', 'sign-pdf'
  ]

  const imageTools = [
    'convert-image', 'compress-image', 'resize-image', 'crop-image', 'rotate-flip-image',
    'remove-exif', 'watermark-image', 'heic-to-jpg', 'images-to-pdf', 'pdf-to-images'
  ]

  const archiveTools = [
    'zip-create', 'zip-extract', '7z-extract', 'tar-extract', 'tar-gz-create'
  ]

  const textTools = [
    'case-converter', 'word-counter', 'text-diff', 'extract-emails', 'extract-urls',
    'base64-encode-decode', 'url-encode-decode', 'hash-generator', 'uuid-generator',
    'password-generator', 'json-formatter', 'csv-json-converter', 'qr-code-generator',
    'barcode-generator', 'unix-time-converter', 'file-size-converter'
  ]

  if (pdfTools.includes(toolName)) return 'pdf'
  if (imageTools.includes(toolName)) return 'images'
  if (archiveTools.includes(toolName)) return 'archive'
  if (textTools.includes(toolName)) return 'text'

  return 'unknown'
}
