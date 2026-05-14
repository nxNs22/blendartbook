import type { Metadata } from "next";
import { AuthProvider } from "./context/AuthContext"; 
import { CartProvider } from "./context/CartContext";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIChatWidget from "./components/AIChatWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlendArtBook | Premium Online Bookstore",
  description: "Discover a world of literature, art, and handmade books at BlendArtBook. Secure shopping with worldwide delivery.",
  metadataBase: new URL('https://blendartbook.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <Header />
              
              <main className="min-h-screen w-full">
                {children}
              </main>
              
              <Footer />
              <AIChatWidget />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
