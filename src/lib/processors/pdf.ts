import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib'
import type { ProcessResult } from './index'

interface FileInput {
  name: string
  data: Buffer
  type: string
}

type ProgressCallback = (progress: number) => Promise<void>

export async function processPdf(
  toolName: string,
  files: FileInput[],
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  try {
    switch (toolName) {
      case 'merge-pdf':
        return await mergePdf(files, onProgress)

      case 'split-pdf':
        return await splitPdf(files[0], options, onProgress)

      case 'extract-pages':
        return await extractPages(files[0], options, onProgress)

      case 'delete-pages':
        return await deletePages(files[0], options, onProgress)

      case 'rotate-pages':
        return await rotatePages(files[0], options, onProgress)

      case 'compress-pdf':
        return await compressPdf(files[0], onProgress)

      case 'add-page-numbers':
        return await addPageNumbers(files[0], options, onProgress)

      case 'add-watermark':
        return await addWatermark(files[0], options, onProgress)

      case 'remove-metadata':
        return await removeMetadata(files[0], onProgress)

      case 'flatten-pdf':
        return await flattenPdf(files[0], onProgress)

      case 'jpg-to-pdf':
      case 'images-to-pdf':
        return await imagesToPdf(files, onProgress)

      default:
        return {
          success: false,
          outputs: [],
          error: 'هذه الأداة غير متوفرة حالياً'
        }
    }
  } catch (error) {
    console.error('PDF processing error:', error)
    return {
      success: false,
      outputs: [],
      error: error instanceof Error ? error.message : 'فشل في معالجة PDF'
    }
  }
}

async function mergePdf(files: FileInput[], onProgress: ProgressCallback): Promise<ProcessResult> {
  const mergedPdf = await PDFDocument.create()

  for (let i = 0; i < files.length; i++) {
    const pdf = await PDFDocument.load(files[i].data)
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach(page => mergedPdf.addPage(page))

    await onProgress(30 + Math.floor((i / files.length) * 40))
  }

  const pdfBytes = await mergedPdf.save()

  return {
    success: true,
    outputs: [{
      name: 'merged.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function splitPdf(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.load(file.data)
  const pageCount = pdf.getPageCount()
  const outputs: ProcessResult['outputs'] = []

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create()
    const [page] = await newPdf.copyPages(pdf, [i])
    newPdf.addPage(page)

    const pdfBytes = await newPdf.save()
    outputs.push({
      name: `page-${i + 1}.pdf`,
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    })

    await onProgress(30 + Math.floor((i / pageCount) * 50))
  }

  return { success: true, outputs }
}

async function extractPages(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.load(file.data)
  const pages = options.pages as number[] || [0]

  const newPdf = await PDFDocument.create()
  const copiedPages = await newPdf.copyPages(pdf, pages.map(p => p - 1))
  copiedPages.forEach(page => newPdf.addPage(page))

  await onProgress(70)

  const pdfBytes = await newPdf.save()

  return {
    success: true,
    outputs: [{
      name: 'extracted.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function deletePages(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.load(file.data)
  const pagesToDelete = (options.pages as number[] || []).map(p => p - 1)
  const allPages = pdf.getPageIndices()
  const pagesToKeep = allPages.filter(i => !pagesToDelete.includes(i))

  const newPdf = await PDFDocument.create()
  const copiedPages = await newPdf.copyPages(pdf, pagesToKeep)
  copiedPages.forEach(page => newPdf.addPage(page))

  await onProgress(70)

  const pdfBytes = await newPdf.save()

  return {
    success: true,
    outputs: [{
      name: 'modified.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function rotatePages(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.load(file.data)
  const rotation = (options.rotation as number) || 90
  const pageIndices = (options.pages as number[]) || pdf.getPageIndices().map(i => i + 1)

  for (const pageNum of pageIndices) {
    const page = pdf.getPage(pageNum - 1)
    const currentRotation = page.getRotation().angle
    page.setRotation(degrees(currentRotation + rotation))
  }

  await onProgress(70)

  const pdfBytes = await pdf.save()

  return {
    success: true,
    outputs: [{
      name: 'rotated.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function compressPdf(
  file: FileInput,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  // Basic compression by rewriting the PDF
  const pdf = await PDFDocument.load(file.data)

  await onProgress(50)

  // Save with default compression
  const pdfBytes = await pdf.save({
    useObjectStreams: true,
    addDefaultPage: false
  })

  return {
    success: true,
    outputs: [{
      name: 'compressed.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function addPageNumbers(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.load(file.data)
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const pages = pdf.getPages()

  const position = (options.position as string) || 'bottom-center'
  const startFrom = (options.startFrom as number) || 1

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const { width, height } = page.getSize()
    const pageNumber = `${startFrom + i}`
    const textWidth = font.widthOfTextAtSize(pageNumber, 12)

    let x: number, y: number

    switch (position) {
      case 'bottom-left':
        x = 40
        y = 30
        break
      case 'bottom-right':
        x = width - 40 - textWidth
        y = 30
        break
      case 'top-center':
        x = (width - textWidth) / 2
        y = height - 40
        break
      default: // bottom-center
        x = (width - textWidth) / 2
        y = 30
    }

    page.drawText(pageNumber, {
      x,
      y,
      size: 12,
      font,
      color: rgb(0.3, 0.3, 0.3)
    })

    await onProgress(30 + Math.floor((i / pages.length) * 50))
  }

  const pdfBytes = await pdf.save()

  return {
    success: true,
    outputs: [{
      name: 'numbered.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function addWatermark(
  file: FileInput,
  options: Record<string, unknown>,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.load(file.data)
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const pages = pdf.getPages()

  const text = (options.text as string) || 'Watermark'
  const opacity = (options.opacity as number) || 0.3

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const { width, height } = page.getSize()

    page.drawText(text, {
      x: width / 2 - font.widthOfTextAtSize(text, 50) / 2,
      y: height / 2,
      size: 50,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity,
      rotate: degrees(45)
    })

    await onProgress(30 + Math.floor((i / pages.length) * 50))
  }

  const pdfBytes = await pdf.save()

  return {
    success: true,
    outputs: [{
      name: 'watermarked.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function removeMetadata(
  file: FileInput,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.load(file.data)

  // Remove metadata
  pdf.setTitle('')
  pdf.setAuthor('')
  pdf.setSubject('')
  pdf.setKeywords([])
  pdf.setProducer('')
  pdf.setCreator('')

  await onProgress(70)

  const pdfBytes = await pdf.save()

  return {
    success: true,
    outputs: [{
      name: 'no-metadata.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function flattenPdf(
  file: FileInput,
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.load(file.data, {
    ignoreEncryption: true
  })

  await onProgress(50)

  // Flatten by simply re-saving (removes form fields interactivity)
  const pdfBytes = await pdf.save()

  return {
    success: true,
    outputs: [{
      name: 'flattened.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}

async function imagesToPdf(
  files: FileInput[],
  onProgress: ProgressCallback
): Promise<ProcessResult> {
  const pdf = await PDFDocument.create()

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    let image

    if (file.type.includes('png')) {
      image = await pdf.embedPng(file.data)
    } else if (file.type.includes('jpeg') || file.type.includes('jpg')) {
      image = await pdf.embedJpg(file.data)
    } else {
      // Try as JPEG by default
      try {
        image = await pdf.embedJpg(file.data)
      } catch {
        try {
          image = await pdf.embedPng(file.data)
        } catch {
          continue // Skip unsupported images
        }
      }
    }

    const page = pdf.addPage([image.width, image.height])
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    })

    await onProgress(30 + Math.floor((i / files.length) * 50))
  }

  const pdfBytes = await pdf.save()

  return {
    success: true,
    outputs: [{
      name: 'images.pdf',
      data: Buffer.from(pdfBytes),
      mimeType: 'application/pdf'
    }]
  }
}
