# Xeer Files - أدوات ملفات مجانية

<div align="center">

![Xeer Files](https://img.shields.io/badge/Xeer%20Files-أدوات%20ملفات%20مجانية-red?style=for-the-badge)

**موقع أدوات ملفات مجاني لتحويل وضغط ومعالجة PDF والصور والمستندات**

[العرض المباشر](https://xeer-files.netlify.app) · [الإبلاغ عن مشكلة](https://github.com/Exxd00/xeer-files/issues)

</div>

---

## المميزات

- **50+ أداة مجانية** - PDF، صور، OCR، أرشفة، نصوص
- **واجهة عربية** - تصميم RTL أصلي
- **سريع وآمن** - معالجة على الخادم مع حذف تلقائي
- **بدون تسجيل** - استخدام فوري بدون حساب
- **خصوصية تامة** - حذف الملفات خلال ساعتين

## الأدوات المتوفرة

### PDF
- ضغط PDF
- دمج PDF
- تقسيم PDF
- استخراج صفحات
- حذف صفحات
- إعادة ترتيب الصفحات
- تدوير الصفحات
- PDF إلى صور
- صور إلى PDF
- إضافة علامة مائية
- ترقيم الصفحات
- حماية PDF
- إزالة البيانات الوصفية
- والمزيد...

### الصور
- تحويل صيغة الصورة
- ضغط الصور
- تغيير حجم الصورة
- قص الصورة
- تدوير وقلب الصورة
- إزالة بيانات EXIF
- علامة مائية للصور
- HEIC إلى JPG

### OCR (التعرف الضوئي)
- استخراج نص من صورة (عربي + إنجليزي)
- استخراج نص من PDF
- PDF قابل للبحث
- استخراج جدول إلى CSV

### الأرشفة
- إنشاء ZIP
- فك ZIP
- فك 7Z
- فك TAR
- إنشاء TAR.GZ

### أدوات النص والترميز
- محول الحالة
- عداد الكلمات
- مقارنة النصوص
- استخراج الإيميلات
- استخراج الروابط
- Base64 تشفير/فك
- توليد Hash
- توليد UUID
- توليد كلمة مرور
- تنسيق JSON
- والمزيد...

### أدوات إضافية
- توليد QR Code
- توليد Barcode
- محول Unix Time
- محول حجم الملفات

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|----------|
| Next.js 14 | إطار العمل الأساسي |
| React | واجهة المستخدم |
| Tailwind CSS | التنسيق |
| shadcn/ui | مكونات UI |
| Supabase | قاعدة البيانات والتخزين |
| pdf-lib | معالجة PDF |
| sharp | معالجة الصور |
| archiver | ضغط الملفات |

## التثبيت المحلي

### المتطلبات
- [Bun](https://bun.sh/) v1.0+
- حساب [Supabase](https://supabase.com/)

### الخطوات

1. **استنساخ المستودع**
```bash
git clone https://github.com/Exxd00/xeer-files.git
cd xeer-files
```

2. **تثبيت التبعيات**
```bash
bun install
```

3. **إعداد المتغيرات البيئية**
```bash
cp .env.example .env.local
```

ثم عدّل `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. **تشغيل التطوير**
```bash
bun run dev
```

5. **فتح المتصفح**
```
http://localhost:3000
```

## التشغيل باستخدام Docker

```bash
# التطوير
docker-compose --profile dev up

# الإنتاج
docker-compose up --build
```

## إعداد Supabase

### جدول Jobs
```sql
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_name TEXT NOT NULL,
  status TEXT DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  input_files JSONB DEFAULT '[]',
  output_files JSONB DEFAULT '[]',
  options JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 hours')
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create jobs" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Anyone can update jobs" ON jobs FOR UPDATE USING (true);
```

### Storage Buckets
- `uploads` - للملفات المرفوعة (private)
- `results` - للنتائج (private)

## GitHub Secrets

للنشر التلقائي، أضف هذه الأسرار في GitHub:

| Secret | الوصف |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | مفتاح Anon |
| `SUPABASE_SERVICE_ROLE_KEY` | مفتاح Service Role |
| `NETLIFY_AUTH_TOKEN` | توكن Netlify |
| `NETLIFY_SITE_ID` | معرف الموقع |

## الهيكل

```
xeer-files/
├── src/
│   ├── app/                    # صفحات Next.js
│   │   ├── api/               # API Routes
│   │   ├── tools/[toolId]/    # صفحات الأدوات
│   │   ├── thanks/            # صفحة النجاح
│   │   ├── error-page/        # صفحة الخطأ
│   │   ├── privacy/           # سياسة الخصوصية
│   │   └── terms/             # شروط الاستخدام
│   ├── components/            # مكونات React
│   │   ├── layout/           # Header, Footer
│   │   ├── tools/            # ToolCard, FileUpload
│   │   └── ui/               # shadcn/ui
│   └── lib/
│       ├── processors/        # معالجات الملفات
│       ├── supabase/         # عملاء Supabase
│       └── tools/            # تعريفات الأدوات
├── .github/workflows/         # GitHub Actions
├── Dockerfile                 # Docker
├── docker-compose.yml         # Docker Compose
└── package.json
```

## المساهمة

المساهمات مرحب بها! يرجى:

1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص بموجب MIT License.

---

<div align="center">

صُنع بـ ❤️ للمجتمع العربي

</div>
