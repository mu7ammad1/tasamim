import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";

const inter = Cairo({ subsets: ["arabic"], weight: "700" });

export const metadata: Metadata = {
  title: {
    template: '%s - تصاميم',
    default: 'تصاميم اول منصة لعرض التصميمات و الاعمال',
  },
  description: "تصاميم اول منصة لعرض التصميمات و الاعمال",
  robots: {
    index: true,  // السماح بأرشفة الصفحة.
    follow: true,  // السماح بتتبع الروابط الموجودة في الصفحة.
    nocache: false, // السماح لمحركات البحث بحفظ نسخة مؤرشفة من الصفحة.
    googleBot: {
      index: true,  // السماح لـ Googlebot بأرشفة الصفحة.
      follow: true,  // السماح لـ Googlebot بتتبع الروابط.
      noimageindex: false,  // السماح لـ Googlebot بأرشفة الصور.
      'max-video-preview': 'large',  // السماح بـ معاينات الفيديو الكبيرة.
      'max-image-preview': 'large',  // السماح بـ معاينات الصور الكبيرة.
      'max-snippet': -1,  // السماح لـ Googlebot بإظهار مقاطع مقتبسة (snippets).
    },
  },
  verification: {
    google: 'google.........',
  },
  generator: 'منصة تصاميم',
  applicationName: 'منصة تصاميم',
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL('https://tasamim.co'),
  themeColor: `#ffffff`,
};

export default function RootLayout({
  modal,
  children,
}: Readonly<{
  modal: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className={inter.className + 'w-full bg-white flex justify-center'}>
        <section className="max-w-7xl w-full">
          <Navbar />
          {modal}
          {children}
        </section>
      </body>
    </html>
  );
}
