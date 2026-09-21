import type { Metadata } from "next";
import "./globals.css";
import "./admin.css";
import "./public-links.css";
import "./mobile-refinement.css";

export const metadata: Metadata = {
  title: "Casamento Comunitário",
  description: "Inscrição e triagem para casamento comunitário.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
