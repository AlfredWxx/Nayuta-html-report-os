import type { Metadata } from "next";
import "../report-design-system/styles/report-theme.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal HTML Report OS",
  description: "A private reading space for AI-generated reports."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
