import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Shield, Clock, Lock, Trash2, Server, Eye } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl font-bold mb-8 text-center">سياسة الخصوصية</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Intro */}
            <div className="bg-muted/50 rounded-2xl p-6 mb-8">
              <p className="text-lg leading-relaxed m-0">
                في Xeer Files، نأخذ خصوصيتك على محمل الجد. هذه السياسة توضح كيف نتعامل مع ملفاتك وبياناتك.
              </p>
            </div>

            {/* Key Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border">
                <Trash2 className="h-6 w-6 text-red-500 shrink-0" />
                <div>
                  <h3 className="font-semibold m-0">حذف تلقائي</h3>
                  <p className="text-sm text-muted-foreground m-0">الملفات تُحذف خلال ساعتين</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border">
                <Lock className="h-6 w-6 text-green-500 shrink-0" />
                <div>
                  <h3 className="font-semibold m-0">تشفير كامل</h3>
                  <p className="text-sm text-muted-foreground m-0">اتصال مشفر بـ SSL/TLS</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border">
                <Eye className="h-6 w-6 text-blue-500 shrink-0" />
                <div>
                  <h3 className="font-semibold m-0">لا تتبع</h3>
                  <p className="text-sm text-muted-foreground m-0">لا نتتبع محتوى ملفاتك</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border">
                <Server className="h-6 w-6 text-purple-500 shrink-0" />
                <div>
                  <h3 className="font-semibold m-0">خوادم آمنة</h3>
                  <p className="text-sm text-muted-foreground m-0">معالجة على خوادم محمية</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                جمع البيانات
              </h2>
              <p>
                نحن نجمع الحد الأدنى من البيانات اللازمة لتشغيل الخدمة:
              </p>
              <ul>
                <li><strong>الملفات المرفوعة:</strong> تُخزن مؤقتاً للمعالجة فقط</li>
                <li><strong>بيانات الاستخدام:</strong> إحصائيات مجهولة عن استخدام الأدوات</li>
                <li><strong>لا نجمع:</strong> بيانات شخصية، حسابات، أو معلومات تعريفية</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6" />
                الاحتفاظ بالملفات
              </h2>
              <ul>
                <li>الملفات المرفوعة تُحذف تلقائياً بعد ساعتين من الرفع</li>
                <li>الملفات الناتجة تُحذف تلقائياً بعد ساعتين من إنشائها</li>
                <li>لا نحتفظ بأي نسخ احتياطية من ملفات المستخدمين</li>
                <li>لا يمكن استعادة الملفات بعد حذفها</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6" />
                الأمان
              </h2>
              <ul>
                <li>جميع الاتصالات مشفرة باستخدام HTTPS/TLS</li>
                <li>الملفات مخزنة في تخزين آمن مع وصول محدود</li>
                <li>روابط التحميل موقّعة ومؤقتة (Signed URLs)</li>
                <li>لا نشارك ملفاتك مع أي طرف ثالث</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">ملفات تعريف الارتباط (Cookies)</h2>
              <p>
                نستخدم ملفات تعريف الارتباط الضرورية فقط لتشغيل الموقع بشكل صحيح.
                لا نستخدم ملفات تعريف ارتباط للتتبع أو الإعلانات.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">التغييرات على هذه السياسة</h2>
              <p>
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سيتم نشر أي تغييرات على هذه الصفحة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">تواصل معنا</h2>
              <p>
                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني.
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
