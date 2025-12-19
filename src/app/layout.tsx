import type { Metadata } from "next";
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
  description: "Cuidado dental experto con la Dra. Cindy Artiga. Agenda tu cita hoy.",
  icons: {
    icon: '/logo-white.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${openSans.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
