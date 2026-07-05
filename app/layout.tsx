import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FacturaMX — Factura CFDI 4.0 por WhatsApp",
  description:
    "Emite facturas CFDI 4.0 válidas ante el SAT desde una conversación de WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="mt-auto py-6 text-center text-xs text-gray-500">
          <a href="/privacidad" className="underline">Aviso de Privacidad</a>
          {" · "}
          <a href="/terminos" className="underline">Términos de Servicio</a>
        </footer>
      </body>
    </html>
  );
}
