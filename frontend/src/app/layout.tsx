import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AppLayout } from "@/components/layout/app-layout";
import { QueryProvider } from "@/components/providers/query-provider";
import { SolanaProvider } from "@/components/providers/solana-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFT Marketplace",
  description: "A Solana NFT marketplace.",
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SolanaProvider>
            <QueryProvider>
              <AppLayout>{children}</AppLayout>
              {modal}
            </QueryProvider>
          </SolanaProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
