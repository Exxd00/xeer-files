import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ToolCard } from '@/components/tools/ToolCard'
import { categories, getToolsByCategory } from '@/lib/tools'
import { Shield, Zap, Clock, Trash2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 to-background py-20 lg:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              أدوات ملفات مجانية
              <span className="block text-primary mt-2">بسيطة وسريعة</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              تحويل، ضغط، دمج، تقسيم PDF والصور والمستندات.
              لا تسجيل، لا رسوم، خصوصية تامة.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span className="text-sm font-medium">سريع جداً</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border">
                <Shield className="h-6 w-6 text-green-500" />
                <span className="text-sm font-medium">آمن ومشفر</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border">
                <Trash2 className="h-6 w-6 text-red-500" />
                <span className="text-sm font-medium">حذف تلقائي</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border">
                <Clock className="h-6 w-6 text-blue-500" />
                <span className="text-sm font-medium">24/7 متاح</span>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Tools by Category */}
        {categories.map((category) => {
          const tools = getToolsByCategory(category.id)
          const Icon = category.icon

          return (
            <section
              key={category.id}
              id={category.id}
              className="py-16 border-t first:border-t-0"
            >
              <div className="container mx-auto px-4">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`${category.color} p-3 rounded-xl text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.nameEn}</p>
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        {/* Privacy Notice */}
        <section className="py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">خصوصيتك أولويتنا</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              جميع الملفات المرفوعة يتم حذفها تلقائياً خلال ساعتين من المعالجة.
              لا نحتفظ بأي نسخ من ملفاتك ولا نشاركها مع أي طرف ثالث.
              معالجة الملفات تتم على خوادم آمنة ومشفرة.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
