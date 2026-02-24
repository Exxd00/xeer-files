import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAnonClient } from '@/lib/supabase/server'
import { getToolById } from '@/lib/tools'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const toolId = formData.get('toolId') as string
    const optionsStr = formData.get('options') as string
    const options = optionsStr ? JSON.parse(optionsStr) : {}

    // Validate tool
    const tool = getToolById(toolId)
    if (!tool) {
      return NextResponse.json(
        { message: 'الأداة غير موجودة' },
        { status: 400 }
      )
    }

    // Get files
    const files: File[] = []
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value)
      }
    }

    // Validate files
    if (files.length === 0 && tool.maxFiles > 0) {
      return NextResponse.json(
        { message: 'يرجى رفع ملف واحد على الأقل' },
        { status: 400 }
      )
    }

    if (files.length > tool.maxFiles) {
      return NextResponse.json(
        { message: `الحد الأقصى ${tool.maxFiles} ملفات` },
        { status: 400 }
      )
    }

    // Check file sizes
    for (const file of files) {
      if (file.size > tool.maxFileSize * 1024 * 1024) {
        return NextResponse.json(
          { message: `الملف ${file.name} أكبر من الحد المسموح (${tool.maxFileSize} ميجابايت)` },
          { status: 400 }
        )
      }
    }

    const supabase = createAnonClient()

    // Upload files to storage
    const inputFiles: { name: string; path: string; size: number }[] = []

    for (const file of files) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
      const filePath = `jobs/${fileName}`

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return NextResponse.json(
          { message: 'فشل في رفع الملف' },
          { status: 500 }
        )
      }

      inputFiles.push({
        name: file.name,
        path: filePath,
        size: file.size
      })
    }

    // Create job record
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        tool_name: toolId,
        status: 'queued',
        progress: 0,
        input_files: inputFiles,
        output_files: [],
        options: options
      })
      .select('id')
      .single()

    if (jobError) {
      console.error('Job creation error:', jobError)
      return NextResponse.json(
        { message: 'فشل في إنشاء المهمة' },
        { status: 500 }
      )
    }

    return NextResponse.json({ jobId: job.id })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
