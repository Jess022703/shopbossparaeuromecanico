import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EuroShop | Euromecanico Corp",
  description: "Sistema de administracion de taller para especialistas europeos y Porsche."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
