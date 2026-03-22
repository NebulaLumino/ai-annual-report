import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Annual Report Generator",
  description: "Generate professional annual reports with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
