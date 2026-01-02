import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/toaster"
import React from "react";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: "Library Management System",
    template: "%s | Library Management System",
  },
  description: "A comprehensive library management system for borrowing books, managing loans, and more.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://library.example.com",
    siteName: "Library Management System",
    title: "Library Management System",
    description: "A comprehensive library management system for borrowing books, managing loans, and more.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <QueryProvider>
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider accessToken={accessToken}>
                {children}
              </AuthProvider>
              <Toaster />
            </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
