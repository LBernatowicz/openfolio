import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenFolio",
  description: "Portfolio and Blog",
};

// Root layout - internationalization is handled in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        {children}
      </body>
    </html>
  );
}
