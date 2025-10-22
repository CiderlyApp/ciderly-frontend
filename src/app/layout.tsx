// src/app/layout.tsx

import "./globals.css";

// Этот layout - точка входа для Next.js и глобальных стилей.
// Он должен содержать базовую HTML-структуру.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ИСПРАВЛЕНО: Убираем теги <html> и <body> отсюда.
  // Они определяются в [locale]/layout.tsx, чтобы избежать вложенности
  // и ошибки гидратации. Этот компонент теперь просто "пропускает"
  // дочерние элементы дальше по дереву.
  return <>{children}</>;
}