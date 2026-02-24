'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import {
  XCircle,
  RefreshCw,
  ArrowLeft,
  HelpCircle,
  AlertTriangle
} from 'lucide-react'

interface ErrorInfo {
  toolId: string
  toolName: string
  error: string
}

export default function ErrorPage() {
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('lastError')
    if (stored) {
      setErrorInfo(JSON.parse(stored))
    }
  }, [])

  const possibleSolutions = [
    'تأكد من أن الملف غير تالف أو معطوب',
    'تأكد من أن حجم الملف ضمن الحد المسموح',
    'جرب استخدام ملف بصيغة مختلفة',
    'تأكد من اتصالك بالإنترنت',
    'حاول مرة أخرى بعد قليل'
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Error Message */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-6">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-3">حدث خطأ!</h1>
            <p className="text-muted-foreground">
              {errorInfo
                ? `فشلت معالجة الملف باستخدام ${errorInfo.toolName}`
                : 'حدث خطأ أثناء معالجة طلبك'}
            </p>
          </div>

          {/* Error Details */}
          {errorInfo?.error && (
            <Card className="mb-8 border-destructive/50">
              <CardContent className="py-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">تفاصيل الخطأ</h3>
                    <p className="text-sm text-muted-foreground">{errorInfo.error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Possible Solutions */}
          <Card className="mb-8">
            <CardContent className="py-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-3">حلول مقترحة</h3>
                  <ul className="space-y-2">
                    {possibleSolutions.map((solution, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {errorInfo && (
              <Link href={`/tools/${errorInfo.toolId}`} className="flex-1">
                <Button className="w-full" size="lg">
                  <RefreshCw className="h-5 w-5 ml-2" />
                  حاول مرة أخرى
                </Button>
              </Link>
            )}
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                <ArrowLeft className="h-5 w-5 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
