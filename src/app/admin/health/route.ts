import { NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase/server'

export async function GET() {
  const checks: Record<string, { status: 'ok' | 'error'; message?: string }> = {}

  // Check Supabase connection
  try {
    const supabase = createAnonClient()
    const { error } = await supabase.from('jobs').select('id').limit(1)

    if (error) {
      checks.supabase = { status: 'error', message: error.message }
    } else {
      checks.supabase = { status: 'ok' }
    }
  } catch (error) {
    checks.supabase = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  // Check Storage
  try {
    const supabase = createAnonClient()
    const { error: uploadsError } = await supabase.storage.from('uploads').list('', { limit: 1 })
    const { error: resultsError } = await supabase.storage.from('results').list('', { limit: 1 })

    if (uploadsError || resultsError) {
      checks.storage = {
        status: 'error',
        message: uploadsError?.message || resultsError?.message
      }
    } else {
      checks.storage = { status: 'ok' }
    }
  } catch (error) {
    checks.storage = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  // Check if required libraries are available
  try {
    const pdfLib = await import('pdf-lib')
    checks.pdfLib = { status: 'ok' }
  } catch {
    checks.pdfLib = { status: 'error', message: 'pdf-lib not available' }
  }

  try {
    const sharp = await import('sharp')
    checks.sharp = { status: 'ok' }
  } catch {
    checks.sharp = { status: 'error', message: 'sharp not available' }
  }

  // Overall status
  const allOk = Object.values(checks).every(c => c.status === 'ok')

  return NextResponse.json({
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks
  }, {
    status: allOk ? 200 : 503
  })
}
