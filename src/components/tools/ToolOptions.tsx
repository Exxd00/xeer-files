'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

interface ToolOptionsProps {
  toolId: string
  options: Record<string, unknown>
  onChange: (options: Record<string, unknown>) => void
}

export function ToolOptions({ toolId, options, onChange }: ToolOptionsProps) {
  const updateOption = (key: string, value: unknown) => {
    onChange({ ...options, [key]: value })
  }

  // QR Code Generator - no file needed
  if (toolId === 'qr-code-generator') {
    return (
      <OptionsCard title="إنشاء QR Code">
        <div className="space-y-4">
          <div>
            <Label htmlFor="qrContent">النص أو الرابط</Label>
            <Textarea
              id="qrContent"
              placeholder="أدخل النص أو الرابط الذي تريد تحويله إلى QR Code"
              value={(options.content as string) || ''}
              onChange={(e) => updateOption('content', e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>
          <div>
            <Label>حجم الصورة: {(options.size as number) || 300}px</Label>
            <Slider
              value={[(options.size as number) || 300]}
              onValueChange={([v]) => updateOption('size', v)}
              min={100}
              max={500}
              step={50}
              className="mt-2"
            />
          </div>
        </div>
      </OptionsCard>
    )
  }

  // Barcode Generator
  if (toolId === 'barcode-generator') {
    return (
      <OptionsCard title="إنشاء Barcode">
        <div className="space-y-4">
          <div>
            <Label htmlFor="barcodeContent">النص أو الرقم</Label>
            <Input
              id="barcodeContent"
              placeholder="أدخل النص أو الرقم"
              value={(options.content as string) || ''}
              onChange={(e) => updateOption('content', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>نوع الباركود</Label>
            <Select
              value={(options.format as string) || 'CODE128'}
              onValueChange={(v) => updateOption('format', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CODE128">Code 128</SelectItem>
                <SelectItem value="EAN13">EAN-13</SelectItem>
                <SelectItem value="EAN8">EAN-8</SelectItem>
                <SelectItem value="UPC">UPC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </OptionsCard>
    )
  }

  // Unix Time Converter
  if (toolId === 'unix-time-converter') {
    return (
      <OptionsCard title="محول Unix Time">
        <div className="space-y-4">
          <div>
            <Label>الاتجاه</Label>
            <RadioGroup
              value={(options.direction as string) || 'unix-to-date'}
              onValueChange={(v) => updateOption('direction', v)}
              className="mt-2 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="unix-to-date" id="unix-to-date" />
                <Label htmlFor="unix-to-date" className="font-normal">Unix Timestamp → تاريخ</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="date-to-unix" id="date-to-unix" />
                <Label htmlFor="date-to-unix" className="font-normal">تاريخ → Unix Timestamp</Label>
              </div>
            </RadioGroup>
          </div>
          {(options.direction as string) === 'date-to-unix' ? (
            <div>
              <Label htmlFor="dateInput">التاريخ والوقت</Label>
              <Input
                id="dateInput"
                type="datetime-local"
                value={(options.dateInput as string) || ''}
                onChange={(e) => updateOption('dateInput', e.target.value)}
                className="mt-1"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="unixInput">Unix Timestamp</Label>
              <Input
                id="unixInput"
                type="number"
                placeholder="مثال: 1640000000"
                value={(options.unixInput as string) || ''}
                onChange={(e) => updateOption('unixInput', e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </OptionsCard>
    )
  }

  // File Size Converter
  if (toolId === 'file-size-converter') {
    return (
      <OptionsCard title="محول حجم الملفات">
        <div className="space-y-4">
          <div>
            <Label htmlFor="sizeInput">الحجم</Label>
            <Input
              id="sizeInput"
              type="number"
              placeholder="أدخل الحجم"
              value={(options.size as string) || ''}
              onChange={(e) => updateOption('size', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>الوحدة الأصلية</Label>
            <Select
              value={(options.fromUnit as string) || 'bytes'}
              onValueChange={(v) => updateOption('fromUnit', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bytes">بايت (Bytes)</SelectItem>
                <SelectItem value="kb">كيلوبايت (KB)</SelectItem>
                <SelectItem value="mb">ميجابايت (MB)</SelectItem>
                <SelectItem value="gb">جيجابايت (GB)</SelectItem>
                <SelectItem value="tb">تيرابايت (TB)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </OptionsCard>
    )
  }

  // PDF Options
  if (toolId === 'compress-pdf') {
    return (
      <OptionsCard title="إعدادات الضغط">
        <div className="space-y-4">
          <div>
            <Label>مستوى الضغط</Label>
            <RadioGroup
              value={(options.level as string) || 'medium'}
              onValueChange={(v) => updateOption('level', v)}
              className="mt-2 flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low" className="font-normal">منخفض (جودة عالية)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium" className="font-normal">متوسط</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high" className="font-normal">عالي (حجم صغير)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'rotate-pages') {
    return (
      <OptionsCard title="إعدادات التدوير">
        <div className="space-y-4">
          <div>
            <Label>زاوية التدوير</Label>
            <RadioGroup
              value={String((options.rotation as number) || 90)}
              onValueChange={(v) => updateOption('rotation', parseInt(v))}
              className="mt-2 flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="90" id="r90" />
                <Label htmlFor="r90" className="font-normal">90° يمين</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="180" id="r180" />
                <Label htmlFor="r180" className="font-normal">180°</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="270" id="r270" />
                <Label htmlFor="r270" className="font-normal">90° يسار</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="pages">الصفحات (اتركه فارغاً لكل الصفحات)</Label>
            <Input
              id="pages"
              placeholder="مثال: 1,3,5-10"
              value={(options.pagesInput as string) || ''}
              onChange={(e) => updateOption('pagesInput', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'extract-pages' || toolId === 'delete-pages') {
    return (
      <OptionsCard title={toolId === 'extract-pages' ? 'الصفحات للاستخراج' : 'الصفحات للحذف'}>
        <div className="space-y-2">
          <Label htmlFor="pages">أرقام الصفحات</Label>
          <Input
            id="pages"
            placeholder="مثال: 1,3,5-10"
            value={(options.pagesInput as string) || ''}
            onChange={(e) => updateOption('pagesInput', e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            أدخل أرقام الصفحات مفصولة بفواصل، أو نطاق مثل 5-10
          </p>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'add-watermark') {
    return (
      <OptionsCard title="إعدادات العلامة المائية">
        <div className="space-y-4">
          <div>
            <Label htmlFor="text">نص العلامة المائية</Label>
            <Input
              id="text"
              placeholder="مثال: سري للغاية"
              value={(options.text as string) || ''}
              onChange={(e) => updateOption('text', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>الشفافية: {Math.round(((options.opacity as number) || 0.3) * 100)}%</Label>
            <Slider
              value={[((options.opacity as number) || 0.3) * 100]}
              onValueChange={([v]) => updateOption('opacity', v / 100)}
              min={10}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'add-page-numbers') {
    return (
      <OptionsCard title="إعدادات ترقيم الصفحات">
        <div className="space-y-4">
          <div>
            <Label>موضع الأرقام</Label>
            <Select
              value={(options.position as string) || 'bottom-center'}
              onValueChange={(v) => updateOption('position', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-center">أسفل الوسط</SelectItem>
                <SelectItem value="bottom-left">أسفل اليسار</SelectItem>
                <SelectItem value="bottom-right">أسفل اليمين</SelectItem>
                <SelectItem value="top-center">أعلى الوسط</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="startFrom">البدء من رقم</Label>
            <Input
              id="startFrom"
              type="number"
              min="1"
              value={(options.startFrom as number) || 1}
              onChange={(e) => updateOption('startFrom', parseInt(e.target.value) || 1)}
              className="mt-1"
            />
          </div>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'protect-pdf') {
    return (
      <OptionsCard title="إعدادات الحماية">
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              placeholder="أدخل كلمة المرور"
              value={(options.password as string) || ''}
              onChange={(e) => updateOption('password', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allowPrint">السماح بالطباعة</Label>
            <Switch
              id="allowPrint"
              checked={(options.allowPrint as boolean) ?? true}
              onCheckedChange={(v) => updateOption('allowPrint', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="allowCopy">السماح بالنسخ</Label>
            <Switch
              id="allowCopy"
              checked={(options.allowCopy as boolean) ?? true}
              onCheckedChange={(v) => updateOption('allowCopy', v)}
            />
          </div>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'unlock-pdf') {
    return (
      <OptionsCard title="كلمة المرور">
        <div className="space-y-2">
          <Label htmlFor="password">أدخل كلمة المرور لفتح الملف</Label>
          <Input
            id="password"
            type="password"
            placeholder="كلمة المرور"
            value={(options.password as string) || ''}
            onChange={(e) => updateOption('password', e.target.value)}
          />
        </div>
      </OptionsCard>
    )
  }

  // Image Options
  if (toolId === 'convert-image') {
    return (
      <OptionsCard title="صيغة التحويل">
        <div className="space-y-2">
          <Label>الصيغة المطلوبة</Label>
          <RadioGroup
            value={(options.format as string) || 'png'}
            onValueChange={(v) => updateOption('format', v)}
            className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {['png', 'jpeg', 'webp', 'avif', 'gif', 'tiff'].map((fmt) => (
              <div key={fmt} className="flex items-center gap-2">
                <RadioGroupItem value={fmt} id={fmt} />
                <Label htmlFor={fmt} className="font-normal uppercase">{fmt}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'compress-image') {
    return (
      <OptionsCard title="إعدادات الضغط">
        <div className="space-y-4">
          <div>
            <Label>الجودة: {(options.quality as number) || 80}%</Label>
            <Slider
              value={[(options.quality as number) || 80]}
              onValueChange={([v]) => updateOption('quality', v)}
              min={10}
              max={100}
              step={5}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              جودة أقل = حجم أصغر
            </p>
          </div>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'resize-image') {
    return (
      <OptionsCard title="أبعاد الصورة">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="width">العرض (بكسل)</Label>
              <Input
                id="width"
                type="number"
                placeholder="تلقائي"
                value={(options.width as number) || ''}
                onChange={(e) => updateOption('width', e.target.value ? parseInt(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="height">الارتفاع (بكسل)</Label>
              <Input
                id="height"
                type="number"
                placeholder="تلقائي"
                value={(options.height as number) || ''}
                onChange={(e) => updateOption('height', e.target.value ? parseInt(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>طريقة التحجيم</Label>
            <Select
              value={(options.fit as string) || 'inside'}
              onValueChange={(v) => updateOption('fit', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inside">احتواء داخل الأبعاد</SelectItem>
                <SelectItem value="cover">تغطية الأبعاد (مع قص)</SelectItem>
                <SelectItem value="fill">تمديد للأبعاد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'rotate-flip-image') {
    return (
      <OptionsCard title="إعدادات التدوير والقلب">
        <div className="space-y-4">
          <div>
            <Label>التدوير</Label>
            <RadioGroup
              value={String((options.rotation as number) || 0)}
              onValueChange={(v) => updateOption('rotation', parseInt(v))}
              className="mt-2 flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="0" id="r0" />
                <Label htmlFor="r0" className="font-normal">بدون تدوير</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="90" id="ri90" />
                <Label htmlFor="ri90" className="font-normal">90° يمين</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="180" id="ri180" />
                <Label htmlFor="ri180" className="font-normal">180°</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="270" id="ri270" />
                <Label htmlFor="ri270" className="font-normal">90° يسار</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="flipH">قلب أفقي</Label>
            <Switch
              id="flipH"
              checked={(options.flipHorizontal as boolean) || false}
              onCheckedChange={(v) => updateOption('flipHorizontal', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="flipV">قلب رأسي</Label>
            <Switch
              id="flipV"
              checked={(options.flipVertical as boolean) || false}
              onCheckedChange={(v) => updateOption('flipVertical', v)}
            />
          </div>
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'watermark-image') {
    return (
      <OptionsCard title="إعدادات العلامة المائية">
        <div className="space-y-4">
          <div>
            <Label htmlFor="text">نص العلامة المائية</Label>
            <Input
              id="text"
              placeholder="مثال: © اسمك"
              value={(options.text as string) || ''}
              onChange={(e) => updateOption('text', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </OptionsCard>
    )
  }

  // Text Tools Options
  if (toolId === 'case-converter') {
    return (
      <OptionsCard title="نوع التحويل">
        <RadioGroup
          value={(options.case as string) || 'upper'}
          onValueChange={(v) => updateOption('case', v)}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="upper" id="upper" />
            <Label htmlFor="upper" className="font-normal">UPPERCASE - أحرف كبيرة</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="lower" id="lower" />
            <Label htmlFor="lower" className="font-normal">lowercase - أحرف صغيرة</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="title" id="title" />
            <Label htmlFor="title" className="font-normal">Title Case - بداية كل كلمة كبيرة</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="sentence" id="sentence" />
            <Label htmlFor="sentence" className="font-normal">Sentence case - بداية الجمل كبيرة</Label>
          </div>
        </RadioGroup>
      </OptionsCard>
    )
  }

  if (toolId === 'base64-encode-decode') {
    return (
      <OptionsCard title="نوع العملية">
        <RadioGroup
          value={(options.mode as string) || 'encode'}
          onValueChange={(v) => updateOption('mode', v)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="encode" id="encode" />
            <Label htmlFor="encode" className="font-normal">تشفير (Encode)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="decode" id="decode" />
            <Label htmlFor="decode" className="font-normal">فك التشفير (Decode)</Label>
          </div>
        </RadioGroup>
      </OptionsCard>
    )
  }

  if (toolId === 'url-encode-decode') {
    return (
      <OptionsCard title="نوع العملية">
        <RadioGroup
          value={(options.mode as string) || 'encode'}
          onValueChange={(v) => updateOption('mode', v)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="encode" id="encode" />
            <Label htmlFor="encode" className="font-normal">تشفير (Encode)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="decode" id="decode" />
            <Label htmlFor="decode" className="font-normal">فك التشفير (Decode)</Label>
          </div>
        </RadioGroup>
      </OptionsCard>
    )
  }

  if (toolId === 'hash-generator') {
    return (
      <OptionsCard title="خوارزمية التجزئة">
        <RadioGroup
          value={(options.algorithm as string) || 'sha256'}
          onValueChange={(v) => updateOption('algorithm', v)}
          className="grid grid-cols-2 gap-3"
        >
          {['md5', 'sha1', 'sha256', 'sha512'].map((algo) => (
            <div key={algo} className="flex items-center gap-2">
              <RadioGroupItem value={algo} id={algo} />
              <Label htmlFor={algo} className="font-normal uppercase">{algo}</Label>
            </div>
          ))}
        </RadioGroup>
      </OptionsCard>
    )
  }

  if (toolId === 'json-formatter') {
    return (
      <OptionsCard title="نوع العملية">
        <RadioGroup
          value={(options.mode as string) || 'format'}
          onValueChange={(v) => updateOption('mode', v)}
          className="flex gap-4"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="format" id="format" />
            <Label htmlFor="format" className="font-normal">تنسيق (Beautify)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="minify" id="minify" />
            <Label htmlFor="minify" className="font-normal">تصغير (Minify)</Label>
          </div>
        </RadioGroup>
      </OptionsCard>
    )
  }

  if (toolId === 'csv-json-converter') {
    return (
      <OptionsCard title="اتجاه التحويل">
        <RadioGroup
          value={(options.direction as string) || 'csv-to-json'}
          onValueChange={(v) => updateOption('direction', v)}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="csv-to-json" id="csv-to-json" />
            <Label htmlFor="csv-to-json" className="font-normal">CSV → JSON</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="json-to-csv" id="json-to-csv" />
            <Label htmlFor="json-to-csv" className="font-normal">JSON → CSV</Label>
          </div>
        </RadioGroup>
      </OptionsCard>
    )
  }

  if (toolId === 'uuid-generator') {
    return (
      <OptionsCard title="إعدادات التوليد">
        <div className="space-y-2">
          <Label htmlFor="count">عدد المعرفات</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="100"
            value={(options.count as number) || 10}
            onChange={(e) => updateOption('count', Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
          />
        </div>
      </OptionsCard>
    )
  }

  if (toolId === 'password-generator') {
    return (
      <OptionsCard title="إعدادات كلمة المرور">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">الطول</Label>
              <Input
                id="length"
                type="number"
                min="8"
                max="128"
                value={(options.length as number) || 16}
                onChange={(e) => updateOption('length', Math.min(128, Math.max(8, parseInt(e.target.value) || 16)))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="count">العدد</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="50"
                value={(options.count as number) || 10}
                onChange={(e) => updateOption('count', Math.min(50, Math.max(1, parseInt(e.target.value) || 10)))}
                className="mt-1"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="uppercase">أحرف كبيرة (A-Z)</Label>
              <Switch
                id="uppercase"
                checked={(options.uppercase as boolean) ?? true}
                onCheckedChange={(v) => updateOption('uppercase', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="lowercase">أحرف صغيرة (a-z)</Label>
              <Switch
                id="lowercase"
                checked={(options.lowercase as boolean) ?? true}
                onCheckedChange={(v) => updateOption('lowercase', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">أرقام (0-9)</Label>
              <Switch
                id="numbers"
                checked={(options.numbers as boolean) ?? true}
                onCheckedChange={(v) => updateOption('numbers', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="symbols">رموز (!@#$%...)</Label>
              <Switch
                id="symbols"
                checked={(options.symbols as boolean) ?? true}
                onCheckedChange={(v) => updateOption('symbols', v)}
              />
            </div>
          </div>
        </div>
      </OptionsCard>
    )
  }

  // No options needed for this tool
  return null
}

function OptionsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
