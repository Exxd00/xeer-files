'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FileUpload } from '@/components/tools/FileUpload'
import { ToolOptions } from '@/components/tools/ToolOptions'
import { getToolById, tools } from '@/lib/tools'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import {
  Play,
  Clock,
  Info,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import Link from 'next/link'

interface ToolPageProps {
  params: Promise<{ toolId: string }>
}

export default function ToolPage({ params }: ToolPageProps) {
  const { toolId } = use(params)
  const router = useRouter()
  const tool = getToolById(toolId)

  const [files, setFiles] = useState<File[]>([])
  const [options, setOptions] = useState<Record<string, unknown>>({})
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processProgress, setProcessProgress] = useState(0)

  if (!tool) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">الأداة غير موجودة</h1>
            <p className="text-muted-foreground mb-6">
              الأداة التي تبحث عنها غير متوفرة
            </p>
            <Link href="/">
              <Button>العودة للرئيسية</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const Icon = tool.icon

  // Parse page input like "1,3,5-10" to array of page numbers
  const parsePages = (input: string): number[] => {
    if (!input.trim()) return []
    const pages: number[] = []
    const parts = input.split(',').map(p => p.trim())
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()))
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            pages.push(i)
          }
        }
      } else {
        const num = parseInt(part)
        if (!isNaN(num)) pages.push(num)
      }
    }
    return [...new Set(pages)].sort((a, b) => a - b)
  }

  const handleProcess = async () => {
    if (files.length === 0 && tool.maxFiles > 0) {
      toast.error('يرجى اختيار ملف واحد على الأقل')
      return
    }

    // Prepare options with parsed pages if needed
    const processOptions = { ...options }
    if (processOptions.pagesInput) {
      processOptions.pages = parsePages(processOptions.pagesInput as string)
      delete processOptions.pagesInput
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      // Create FormData
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file)
      })
      formData.append('toolId', tool.id)
      formData.append('options', JSON.stringify(processOptions))

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Create job
      const response = await fetch('/api/jobs', {
        method: 'POST',
        body: formData,
      })

      clearInterval(uploadInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'فشل في إنشاء المهمة')
      }

      const { jobId } = await response.json()
      setUploading(false)
      setProcessing(true)
      setProcessProgress(0)

      // Poll for job status
      const pollJob = async () => {
        const statusResponse = await fetch(`/api/jobs/${jobId}`)
        const job = await statusResponse.json()

        if (job.status === 'succeeded') {
          setProcessing(false)
          // Store job info for thanks page
          sessionStorage.setItem('lastJob', JSON.stringify({
            jobId,
            toolId: tool.id,
            toolName: tool.name,
            outputFiles: job.output_files
          }))
          router.push('/thanks')
        } else if (job.status === 'failed') {
          setProcessing(false)
          sessionStorage.setItem('lastError', JSON.stringify({
            toolId: tool.id,
            toolName: tool.name,
            error: job.error_message || 'حدث خطأ غير متوقع'
          }))
          router.push('/error-page')
        } else {
          setProcessProgress(job.progress || 0)
          setTimeout(pollJob, 1000)
        }
      }

      // Start processing
      await fetch(`/api/jobs/${jobId}/process`, { method: 'POST' })
      pollJob()

    } catch (error) {
      console.error('Process error:', error)
      setUploading(false)
      setProcessing(false)
      toast.error(error instanceof Error ? error.message : 'حدث خطأ')
    }
  }

  // Find related tools
  const relatedTools = tools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .slice(0, 3)

  // Check if this tool needs file upload
  const needsFileUpload = tool.maxFiles > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href={`/#${tool.category}`} className="hover:text-foreground transition-colors">
              {tool.category === 'pdf' ? 'أدوات PDF' :
               tool.category === 'images' ? 'أدوات الصور' :
               tool.category === 'ocr' ? 'التعرف الضوئي' :
               tool.category === 'archive' ? 'الأرشفة' :
               tool.category === 'documents' ? 'المستندات' :
               tool.category === 'text' ? 'أدوات النص' : 'إضافات'}
            </Link>
            <span>/</span>
            <span className="text-foreground">{tool.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tool Header */}
              <div className="flex items-start gap-4">
                <div className={`category-${tool.category} p-4 rounded-xl`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{tool.name}</h1>
                  <p className="text-muted-foreground mt-1">{tool.description}</p>
                </div>
              </div>

              {/* File Upload - Only show if tool needs files */}
              {needsFileUpload && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">اختر الملفات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      tool={tool}
                      files={files}
                      setFiles={setFiles}
                      uploading={uploading}
                      uploadProgress={uploadProgress}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Tool Options */}
              <ToolOptions
                toolId={tool.id}
                options={options}
                onChange={setOptions}
              />

              {/* Processing Progress */}
              {processing && (
                <Card className="border-primary">
                  <CardContent className="py-8">
                    <div className="text-center space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                      <div>
                        <h3 className="font-semibold text-lg">جاري المعالجة...</h3>
                        <p className="text-sm text-muted-foreground">
                          يرجى الانتظار حتى اكتمال العملية
                        </p>
                      </div>
                      <div className="max-w-xs mx-auto space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>التقدم</span>
                          <span>{processProgress}%</span>
                        </div>
                        <Progress value={processProgress} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Process Button */}
              {!processing && (
                <Button
                  size="lg"
                  className="w-full py-6 text-lg"
                  onClick={handleProcess}
                  disabled={uploading || (needsFileUpload && files.length === 0)}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin ml-2" />
                      جاري الرفع...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 ml-2" />
                      بدء المعالجة
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tool Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    معلومات الأداة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tool.maxFiles > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">الحد الأقصى للملفات</span>
                        <Badge variant="secondary">{tool.maxFiles} ملفات</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">الحجم الأقصى</span>
                        <Badge variant="secondary">{tool.maxFileSize} ميجابايت</Badge>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">وقت المعالجة</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {tool.processingTime === 'fast' ? 'سريع' :
                       tool.processingTime === 'medium' ? 'متوسط' : 'بطيء'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    المميزات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      مجاني بالكامل
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      لا يتطلب تسجيل
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      حذف تلقائي للملفات
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      معالجة آمنة ومشفرة
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Related Tools */}
              {relatedTools.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">أدوات مشابهة</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {relatedTools.map((t) => {
                      const TIcon = t.icon
                      return (
                        <Link
                          key={t.id}
                          href={`/tools/${t.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <TIcon className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium">{t.name}</span>
                        </Link>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
