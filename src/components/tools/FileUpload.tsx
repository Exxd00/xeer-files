'use client'

import { useCallback, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, File, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatFileSize } from '@/lib/utils'
import type { Tool } from '@/lib/tools'

interface FileUploadProps {
  tool: Tool
  files: File[]
  setFiles: (files: File[]) => void
  uploading?: boolean
  uploadProgress?: number
}

export function FileUpload({
  tool,
  files,
  setFiles,
  uploading = false,
  uploadProgress = 0
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError(null)

    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(f => {
        if (f.errors[0]?.code === 'file-too-large') {
          return `${f.file.name}: الحجم أكبر من ${tool.maxFileSize} ميجابايت`
        }
        if (f.errors[0]?.code === 'file-invalid-type') {
          return `${f.file.name}: نوع الملف غير مدعوم`
        }
        return `${f.file.name}: ${f.errors[0]?.message || 'خطأ غير معروف'}`
      })
      setError(errors.join('\n'))
      return
    }

    if (files.length + acceptedFiles.length > tool.maxFiles) {
      setError(`الحد الأقصى ${tool.maxFiles} ملفات`)
      return
    }

    setFiles([...files, ...acceptedFiles])
  }, [files, setFiles, tool])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: tool.acceptedTypes.length > 0
      ? tool.acceptedTypes.reduce((acc, type) => {
          acc[type] = []
          return acc
        }, {} as Record<string, string[]>)
      : undefined,
    maxSize: tool.maxFileSize * 1024 * 1024,
    maxFiles: tool.maxFiles,
    disabled: uploading,
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
    setError(null)
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`upload-zone text-center ${isDragActive ? 'drag-active' : ''} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium">
              {isDragActive ? 'أفلت الملفات هنا' : 'اسحب الملفات هنا أو انقر للاختيار'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              الحد الأقصى: {tool.maxFiles} ملفات، {tool.maxFileSize} ميجابايت لكل ملف
            </p>
          </div>
          <Button type="button" variant="outline" disabled={uploading}>
            اختر الملفات
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm whitespace-pre-line">{error}</p>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>جاري الرفع...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2 progress-striped" />
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">الملفات المحددة ({files.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <File className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
