// src/app/layout.tsx

import "./globals.css";

// Этот layout - точка входа для Next.js и глобальных стилей.
// Он должен содержать базовую HTML-структуру.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
