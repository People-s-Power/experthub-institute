import type { Metadata } from 'next'
import './globals.css'
import { Providers } from "@/store/providers";
import Analytics from "@/components/Analytics";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'EXPERTHUB INSTITUTE',
  description: "We are determine to raise the next generation of global leaders and empower youths to harness the immense power of technology to overcome the challenges our planet faces, including its dwindling economy. Our platform is more than just a website; it's a thriving community of like-minded individuals who share a passion for change. Together, we learn, grow, and collaborate to make a tangible impact on our communities and planet."
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KKVTDS2T71"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KKVTDS2T71');
          `}
        </Script>
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
