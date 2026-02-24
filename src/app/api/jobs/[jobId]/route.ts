import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const supabase = createAnonClient()

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error || !job) {
      return NextResponse.json(
        { message: 'المهمة غير موجودة' },
        { status: 404 }
      )
    }

    // Generate signed URLs for output files
    if (job.output_files && job.output_files.length > 0) {
      const outputFilesWithUrls = await Promise.all(
        job.output_files.map(async (file: { name: string; path: string }) => {
          const { data } = await supabase.storage
            .from('results')
            .createSignedUrl(file.path, 3600) // 1 hour expiry

          return {
            name: file.name,
            url: data?.signedUrl || '',
            path: file.path
          }
        })
      )
      job.output_files = outputFilesWithUrls
    }

    return NextResponse.json(job)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}
