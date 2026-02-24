import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase/server'
import { processJob } from '@/lib/processors'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params

  // Start processing in background (non-blocking)
  processJobAsync(jobId).catch(console.error)

  return NextResponse.json({ success: true })
}

async function processJobAsync(jobId: string) {
  const supabase = createAnonClient()

  try {
    // Get job
    const { data: job, error: fetchError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (fetchError || !job) {
      console.error('Job not found:', jobId)
      return
    }

    // Update status to running
    await supabase
      .from('jobs')
      .update({ status: 'running', progress: 10 })
      .eq('id', jobId)

    // Process the job
    const result = await processJob(
      job.tool_name,
      job.input_files,
      job.options,
      async (progress: number) => {
        await supabase
          .from('jobs')
          .update({ progress })
          .eq('id', jobId)
      }
    )

    if (result.success) {
      // Upload result files
      const outputFiles: { name: string; path: string }[] = []

      for (const output of result.outputs) {
        const fileName = `${jobId}/${output.name}`

        const { error: uploadError } = await supabase.storage
          .from('results')
          .upload(fileName, output.data, {
            contentType: output.mimeType,
            upsert: true
          })

        if (uploadError) {
          throw new Error(`Failed to upload result: ${uploadError.message}`)
        }

        outputFiles.push({
          name: output.name,
          path: fileName
        })
      }

      // Update job as succeeded
      await supabase
        .from('jobs')
        .update({
          status: 'succeeded',
          progress: 100,
          output_files: outputFiles
        })
        .eq('id', jobId)

    } else {
      throw new Error(result.error || 'Processing failed')
    }

  } catch (error) {
    console.error('Processing error:', error)

    // Update job as failed
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
      })
      .eq('id', jobId)
  }
}
