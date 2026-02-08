import { NotesProvider } from "@/src/context/NotesContext";
import { ModuleProvider } from "@/src/context/ModuleContext";
import "./globals.css";
import type { Metadata } from "next";
import { Ropa_Sans, Sora } from 'next/font/google';
import Script from "next/script";


const ropa = Sora({
  subsets: ['latin'],
  weight: '500',
})

export const metadata: Metadata = {
  title: "Subframe Next.js Starter",
  description: "Your starter kit for integrating Subframe into Next.js",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <Script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></Script>
        <Script noModule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></Script>
        {/* eslint-disable-next-line */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className={ropa.className}>
        <NotesProvider>
          <ModuleProvider>
            {children}
          </ModuleProvider>
        </NotesProvider>
      </body>
    </html>
  )
}
