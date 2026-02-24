'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getToolById, tools } from '@/lib/tools'
import Link from 'next/link'
import {
  CheckCircle2,
  Download,
  ArrowLeft,
  RefreshCw,
  Sparkles
} from 'lucide-react'

interface JobInfo {
  jobId: string
  toolId: string
  toolName: string
  outputFiles: { name: string; url: string; size?: number }[]
}

export default function ThanksPage() {
  const [jobInfo, setJobInfo] = useState<JobInfo | null>(null)
  const [relatedTools, setRelatedTools] = useState<typeof tools>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('lastJob')
    if (stored) {
      const info = JSON.parse(stored) as JobInfo
      setJobInfo(info)

      // Get related tools
      const tool = getToolById(info.toolId)
      if (tool) {
        const related = tools
          .filter(t => t.category === tool.category && t.id !== tool.id)
          .slice(0, 3)
        setRelatedTools(related)
      }
    }
  }, [])

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Download error:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Success Message */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-3">تمت العملية بنجاح!</h1>
            <p className="text-muted-foreground">
              {jobInfo ? `تم معالجة ملفاتك باستخدام ${jobInfo.toolName}` : 'تم معالجة ملفاتك بنجاح'}
            </p>
          </div>

          {/* Download Section */}
          <Card className="mb-8">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <Download className="h-12 w-12 mx-auto text-primary" />
                <h2 className="text-xl font-semibold">تحميل النتيجة</h2>

                {jobInfo?.outputFiles && jobInfo.outputFiles.length > 0 ? (
                  <div className="space-y-3 max-w-sm mx-auto">
                    {jobInfo.outputFiles.map((file, index) => (
                      <Button
                        key={index}
                        size="lg"
                        className="w-full"
                        onClick={() => handleDownload(file.url, file.name)}
                      >
                        <Download className="h-5 w-5 ml-2" />
                        {file.name}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Button size="lg" className="w-full max-w-sm">
                    <Download className="h-5 w-5 ml-2" />
                    تحميل الملف
                  </Button>
                )}

                <p className="text-sm text-muted-foreground">
                  سيتم حذف الملفات تلقائياً خلال ساعتين
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {jobInfo && (
              <Link href={`/tools/${jobInfo.toolId}`} className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  <RefreshCw className="h-5 w-5 ml-2" />
                  استخدام الأداة مرة أخرى
                </Button>
              </Link>
            )}
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <ArrowLeft className="h-5 w-5 ml-2" />
                استكشاف أدوات أخرى
              </Button>
            </Link>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                أدوات قد تهمك
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedTools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link key={tool.id} href={`/tools/${tool.id}`}>
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <div className={`category-${tool.category} p-3 rounded-xl inline-block mb-3`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <h4 className="font-medium text-sm">{tool.name}</h4>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
