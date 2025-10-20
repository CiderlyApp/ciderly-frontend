// src/app/layout.tsx

import "./globals.css";

// Этот layout - просто точка входа для Next.js и глобальных стилей.
// Он не должен создавать никакой HTML-структуры.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}