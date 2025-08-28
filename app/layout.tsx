import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/client-providers";
import { SiteHeader } from "@/components/site-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT English Academy",
  description: "Learn English for IT professionals",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script to apply theme before page load to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Apply dark mode if saved in localStorage
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  
                  // Apply language if saved in localStorage
                  const language = localStorage.getItem('language');
                  if (language && ['uz', 'ru', 'en'].includes(language)) {
                    document.documentElement.lang = language;
                  }
                } catch (e) {
                  console.error('Error applying theme or language:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ClientProviders>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <footer className="w-full bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-8">
            <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <div>
                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
                  KARMADA
                </span>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Yangi avlod uchun zamonaviy bilim va imkoniyatlar platformasi.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <a
                  href="/"
                  className="text-gray-700 dark:text-gray-200 hover:underline"
                >
                  Bosh sahifa
                </a>
                <a
                  href="/about"
                  className="text-gray-700 dark:text-gray-200 hover:underline"
                >
                  Biz haqimizda
                </a>
                <a
                  href="/courses"
                  className="text-gray-700 dark:text-gray-200 hover:underline"
                >
                  Kurslar
                </a>
                <a
                  href="/contact"
                  className="text-gray-700 dark:text-gray-200 hover:underline"
                >
                  Aloqa
                </a>
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                <div>
                  Telefon:{" "}
                  <a href="tel:+998901234567" className="hover:underline">
                    +998 90 123 45 67
                  </a>
                </div>
                <div>
                  Email:{" "}
                  <a href="mailto:info@karmada.uz" className="hover:underline">
                    info@karmada.uz
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center text-xs text-gray-500 dark:text-gray-600 pb-4">
              &copy; {new Date().getFullYear()} KARMADA. Barcha huquqlar
              himoyalangan.
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
