import type { Metadata, Viewport } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Artiga Dental Care | Clínica Dental",
  description: "Cuidado dental experto con la Dra. Cindy Artiga. Agenda tu cita hoy. Servicios: Limpieza, Evaluación, Estética y más.",
  icons: {
    icon: '/logo-white.png',
  },
  openGraph: {
    title: "Artiga Dental Care | Mejorando Sonrisas",
    description: "Servicios dentales profesionales en San Salvador. Agenda tu cita con la Dra. Cindy Artiga hoy mismo.",
    url: 'https://artigadental.com', // Replace with actual domain if known, or generic
    siteName: 'Artiga Dental Care',
    images: [
      {
        url: '/admin-login-logo.png', // Fallback to doctor's photo which is better than blank
        width: 800,
        height: 600,
        alt: 'Artiga Dental Care Logo',
      },
    ],
    locale: 'es_SV',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Artiga Dental Care | Clínica Dental",
    description: "Cuidado dental experto con la Dra. Cindy Artiga.",
    images: ['/admin-login-logo.png'], // Reuse same image
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#edf5f8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning style={{ colorScheme: 'light' }}>
      <body className={`${montserrat.variable} ${openSans.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
