// app/layout.jsx
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Providers from "../components/Providers";

export const metadata = {
  title: "Tienda Demo | Electrónica y Accesorios",
  description: "Explorá los mejores productos electrónicos al mejor precio.",
  openGraph: {
    title: "Tienda Demo",
    description: "E-commerce de electrónica y accesorios",
    url: "https://tutienda.com",
    siteName: "Tienda Demo",
    images: [{ url: "/img/og-image.jpg", width: 1200, height: 630 }],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">git show --stat --name-status 35a705f

       <body className="min-h-screen bg-gray-50">
        <Providers>
          <Header />
          <main className="min-h-[calc(100vh-56px)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
