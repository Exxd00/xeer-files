import Link from 'next/link'
import { FileText, Heart } from 'lucide-react'
import { categories } from '@/lib/tools'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Xeer Files</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              أدوات ملفات مجانية لتحويل وضغط ومعالجة PDF والصور والمستندات.
              أسرع وأسهل أدوات ملفات على الإنترنت.
            </p>
          </div>

          {/* Tools Categories */}
          <div>
            <h3 className="font-semibold mb-4">الأدوات</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/#${cat.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Tools */}
          <div>
            <h3 className="font-semibold mb-4">المزيد</h3>
            <ul className="space-y-2">
              {categories.slice(5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/#${cat.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">القانونية</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Xeer Files. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            صُنع بـ <Heart className="h-4 w-4 text-red-500 fill-red-500" /> للمجتمع العربي
          </p>
        </div>
      </div>
    </footer>
  )
}
