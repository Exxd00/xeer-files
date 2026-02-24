import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Xeer Files - أدوات ملفات مجانية",
  description: "موقع أدوات ملفات مجاني لتحويل وضغط ومعالجة PDF والصور والمستندات. أسرع وأسهل أدوات ملفات على الإنترنت.",
  keywords: ["PDF", "تحويل", "ضغط", "صور", "OCR", "أدوات مجانية"],
  authors: [{ name: "Xeer Files" }],
  openGraph: {
    title: "Xeer Files - أدوات ملفات مجانية",
    description: "موقع أدوات ملفات مجاني لتحويل وضغط ومعالجة PDF والصور والمستندات",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background antialiased">
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            className: 'rtl:text-right',
          }}
        />
      </body>
    </html>
  );
}
