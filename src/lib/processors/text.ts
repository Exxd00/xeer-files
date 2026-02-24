import crypto from 'crypto'
import type { ProcessResult } from './index'

interface FileInput {
  name: string
  data: Buffer
  type: string
}

type ProgressCallback = (progress: number) => Promise<void>

export async function processText(
  toolName: string,
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  try {
    switch (toolName) {
      case 'case-converter':
        return await caseConverter(files[0], options, onProgress)

      case 'word-counter':
        return await wordCounter(files[0], onProgress)

      case 'extract-emails':
        return await extractEmails(files[0], onProgress)

      case 'extract-urls':
        return await extractUrls(files[0], onProgress)

      case 'base64-encode-decode':
        return await base64EncodeDecode(files, options, onProgress)

      case 'url-encode-decode':
        return await urlEncodeDecode(files[0], options, onProgress)

      case 'hash-generator':
        return await hashGenerator(files, options, onProgress)

      case 'uuid-generator':
        return await uuidGenerator(options, onProgress)

      case 'password-generator':
        return await passwordGenerator(options, onProgress)

      case 'json-formatter':
        return await jsonFormatter(files[0], options, onProgress)

      case 'csv-json-converter':
        return await csvJsonConverter(files[0], options, onProgress)

      default:
        return {
          success: false,
          outputs: [],
          error: 'هذه الأداة غير متوفرة حالياً'
        }
    }
  } catch (error) {
    console.error('Text processing error:', error)
    return {
      success: false,
      outputs: [],
      error: error instanceof Error ? error.message : 'فشل في المعالجة'
    }
  }
}

async function caseConverter(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const text = file.data.toString('utf-8')
  const caseType = (options.case as string) || 'upper'

  await onProgress(50)

  let result: string
  switch (caseType) {
    case 'upper':
      result = text.toUpperCase()
      break
    case 'lower':
      result = text.toLowerCase()
      break
    case 'title':
      result = text.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
      break
    case 'sentence':
      result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
      break
    default:
      result = text
  }

  return {
    success: true,
    outputs: [{
      name: 'converted.txt',
      data: Buffer.from(result, 'utf-8'),
      mimeType: 'text/plain'
    }]
  }
}

async function wordCounter(
  file: FileInput,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const text = file.data.toString('utf-8')

  await onProgress(50)

  const words = text.trim().split(/\s+/).filter(w => w.length > 0)
  const characters = text.length
  const charactersNoSpaces = text.replace(/\s/g, '').length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0)
  const lines = text.split(/\n/).length

  const result = {
    words: words.length,
    characters,
    charactersNoSpaces,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    lines
  }

  const output = `إحصائيات النص:
━━━━━━━━━━━━━━━━━━━━━━
الكلمات: ${result.words}
الأحرف: ${result.characters}
الأحرف (بدون مسافات): ${result.charactersNoSpaces}
الجمل: ${result.sentences}
الفقرات: ${result.paragraphs}
الأسطر: ${result.lines}
━━━━━━━━━━━━━━━━━━━━━━`

  return {
    success: true,
    outputs: [{
      name: 'statistics.txt',
      data: Buffer.from(output, 'utf-8'),
      mimeType: 'text/plain'
    }]
  }
}

async function extractEmails(
  file: FileInput,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const text = file.data.toString('utf-8')

  await onProgress(50)

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const emails = [...new Set(text.match(emailRegex) || [])]

  const result = emails.length > 0
    ? emails.join('\n')
    : 'لم يتم العثور على عناوين بريد إلكتروني'

  return {
    success: true,
    outputs: [{
      name: 'emails.txt',
      data: Buffer.from(result, 'utf-8'),
      mimeType: 'text/plain'
    }]
  }
}

async function extractUrls(
  file: FileInput,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const text = file.data.toString('utf-8')

  await onProgress(50)

  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g
  const urls = [...new Set(text.match(urlRegex) || [])]

  const result = urls.length > 0
    ? urls.join('\n')
    : 'لم يتم العثور على روابط'

  return {
    success: true,
    outputs: [{
      name: 'urls.txt',
      data: Buffer.from(result, 'utf-8'),
      mimeType: 'text/plain'
    }]
  }
}

async function base64EncodeDecode(
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const mode = (options.mode as string) || 'encode'
  const file = files[0]

  await onProgress(50)

  let result: Buffer
  let outputName: string

  if (mode === 'encode') {
    result = Buffer.from(file.data.toString('base64'), 'utf-8')
    outputName = 'encoded.txt'
  } else {
    const base64String = file.data.toString('utf-8').trim()
    result = Buffer.from(base64String, 'base64')
    outputName = 'decoded.bin'
  }

  return {
    success: true,
    outputs: [{
      name: outputName,
      data: result,
      mimeType: mode === 'encode' ? 'text/plain' : 'application/octet-stream'
    }]
  }
}

async function urlEncodeDecode(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const mode = (options.mode as string) || 'encode'
  const text = file.data.toString('utf-8')

  await onProgress(50)

  const result = mode === 'encode'
    ? encodeURIComponent(text)
    : decodeURIComponent(text)

  return {
    success: true,
    outputs: [{
      name: mode === 'encode' ? 'url-encoded.txt' : 'url-decoded.txt',
      data: Buffer.from(result, 'utf-8'),
      mimeType: 'text/plain'
    }]
  }
}

async function hashGenerator(
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const algorithm = (options.algorithm as string) || 'sha256'
  const file = files[0]

  await onProgress(50)

  const hash = crypto.createHash(algorithm).update(file.data).digest('hex')

  const result = `الملف: ${file.name}
الخوارزمية: ${algorithm.toUpperCase()}
النتيجة: ${hash}`

  return {
    success: true,
    outputs: [{
      name: `${file.name}.${algorithm}.txt`,
      data: Buffer.from(result, 'utf-8'),
      mimeType: 'text/plain'
    }]
  }
}

async function uuidGenerator(
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const count = Math.min((options.count as number) || 10, 100)

  await onProgress(50)

  const uuids: string[] = []
  for (let i = 0; i < count; i++) {
    uuids.push(crypto.randomUUID())
  }

  return {
    success: true,
    outputs: [{
      name: 'uuids.txt',
      data: Buffer.from(uuids.join('\n'), 'utf-8'),
      mimeType: 'text/plain'
    }]
  }
}

async function passwordGenerator(
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const length = Math.min((options.length as number) || 16, 128)
  const count = Math.min((options.count as number) || 10, 50)
  const includeUppercase = (options.uppercase as boolean) !== false
  const includeLowercase = (options.lowercase as boolean) !== false
  const includeNumbers = (options.numbers as boolean) !== false
  const includeSymbols = (options.symbols as boolean) !== false

  await onProgress(50)

  let charset = ''
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (includeNumbers) charset += '0123456789'
  if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

  if (charset.length === 0) {
    charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  }

  const passwords: string[] = []
  for (let i = 0; i < count; i++) {
    let password = ''
    const randomBytes = crypto.randomBytes(length)
    for (let j = 0; j < length; j++) {
      password += charset[randomBytes[j] % charset.length]
    }
    passwords.push(password)
  }

  return {
    success: true,
    outputs: [{
      name: 'passwords.txt',
      data: Buffer.from(passwords.join('\n'), 'utf-8'),
      mimeType: 'text/plain'
    }]
  }
}

async function jsonFormatter(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const text = file.data.toString('utf-8')
  const mode = (options.mode as string) || 'format'

  await onProgress(40)

  try {
    const json = JSON.parse(text)

    let result: string
    if (mode === 'minify') {
      result = JSON.stringify(json)
    } else {
      result = JSON.stringify(json, null, 2)
    }

    return {
      success: true,
      outputs: [{
        name: mode === 'minify' ? 'minified.json' : 'formatted.json',
        data: Buffer.from(result, 'utf-8'),
        mimeType: 'application/json'
      }]
    }
  } catch (error) {
    return {
      success: false,
      outputs: [],
      error: 'JSON غير صالح'
    }
  }
}

async function csvJsonConverter(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const text = file.data.toString('utf-8')
  const direction = (options.direction as string) || 'csv-to-json'

  await onProgress(50)

  if (direction === 'csv-to-json') {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

    const result = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      const obj: Record<string, string> = {}
      headers.forEach((header, index) => {
        obj[header] = values[index] || ''
      })
      return obj
    })

    return {
      success: true,
      outputs: [{
        name: 'data.json',
        data: Buffer.from(JSON.stringify(result, null, 2), 'utf-8'),
        mimeType: 'application/json'
      }]
    }
  } else {
    try {
      const json = JSON.parse(text)

      if (!Array.isArray(json) || json.length === 0) {
        throw new Error('Expected array of objects')
      }

      const headers = Object.keys(json[0])
      const lines = [headers.join(',')]

      for (const obj of json) {
        const values = headers.map(h => {
          const val = String(obj[h] || '')
          return val.includes(',') ? `"${val}"` : val
        })
        lines.push(values.join(','))
      }

      return {
        success: true,
        outputs: [{
          name: 'data.csv',
          data: Buffer.from(lines.join('\n'), 'utf-8'),
          mimeType: 'text/csv'
        }]
      }
    } catch (error) {
      return {
        success: false,
        outputs: [],
        error: 'تنسيق JSON غير صالح'
      }
    }
  }
}
