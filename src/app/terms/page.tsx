import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FileText, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8 text-center">شروط الاستخدام</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Intro */}
            <div className="bg-muted/50 rounded-2xl p-6 mb-8">
              <p className="text-lg leading-relaxed m-0">
                باستخدام موقع Xeer Files، فإنك توافق على هذه الشروط والأحكام.
                يرجى قراءتها بعناية قبل استخدام خدماتنا.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6" />
                وصف الخدمة
              </h2>
              <p>
                Xeer Files هو موقع يقدم أدوات مجانية لمعالجة الملفات عبر الإنترنت، بما في ذلك:
              </p>
              <ul>
                <li>تحويل وضغط ودمج ملفات PDF</li>
                <li>معالجة وتحويل الصور</li>
                <li>التعرف الضوئي على النصوص (OCR)</li>
                <li>ضغط وفك الأرشيفات</li>
                <li>أدوات النصوص والبيانات</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                الاستخدام المسموح
              </h2>
              <ul>
                <li>استخدام الأدوات لمعالجة ملفاتك الشخصية</li>
                <li>استخدام الأدوات لأغراض تجارية مشروعة</li>
                <li>معالجة الملفات التي تملك حقوقها أو لديك إذن باستخدامها</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-500" />
                الاستخدام المحظور
              </h2>
              <p>يُمنع استخدام الخدمة لـ:</p>
              <ul>
                <li>رفع أو معالجة محتوى غير قانوني</li>
                <li>انتهاك حقوق الملكية الفكرية للآخرين</li>
                <li>محاولة اختراق أو إساءة استخدام الخدمة</li>
                <li>رفع ملفات تحتوي على برمجيات خبيثة</li>
                <li>استخدام الخدمة بطريقة تضر بالآخرين</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                حدود المسؤولية
              </h2>
              <ul>
                <li>الخدمة مقدمة "كما هي" بدون أي ضمانات</li>
                <li>لا نتحمل مسؤولية فقدان البيانات أو الأضرار الناتجة عن استخدام الخدمة</li>
                <li>جودة التحويل قد تختلف حسب نوع الملف ومحتواه</li>
                <li>نحتفظ بحق تعديل أو إيقاف الخدمة في أي وقت</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">حدود الاستخدام</h2>
              <ul>
                <li>الحد الأقصى لحجم الملف يختلف حسب الأداة</li>
                <li>عدد الملفات المسموح معالجتها محدود لكل أداة</li>
                <li>الملفات تُحذف تلقائياً بعد ساعتين</li>
                <li>قد نفرض قيوداً إضافية لمنع إساءة الاستخدام</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">الملكية الفكرية</h2>
              <p>
                جميع حقوق الملكية الفكرية للموقع والأدوات محفوظة لـ Xeer Files.
                المحتوى الذي ترفعه يبقى ملكاً لك ونحن لا ندعي أي حقوق عليه.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">التغييرات على الشروط</h2>
              <p>
                نحتفظ بحق تعديل هذه الشروط في أي وقت. استمرارك في استخدام الخدمة
                بعد أي تغييرات يعني موافقتك على الشروط المحدثة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">القانون المعمول به</h2>
              <p>
                تخضع هذه الشروط وتُفسّر وفقاً للقوانين المعمول بها.
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-8">
              آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
