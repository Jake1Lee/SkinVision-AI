import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientOnly from "@/components/ClientOnly";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Skin Lesion Detection App",
  description: "An AI-powered app for skin lesion detection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@200..800&family=Red+Rose:wght@300..700&display=swap" rel="stylesheet" />
      </head>
      <body 
        className="antialiased"
        style={{ 
          backgroundColor: '#d7d7e7', 
          fontFamily: 'Dosis', 
          fontWeight: 400 
        }}
        suppressHydrationWarning
      >
        <ClientOnly fallback={<div>Loading...</div>}>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
