import Link from "next/link"
import Image from "next/image"
import { BookOpen } from "lucide-react"
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  quote: string
  author: string
  imageSrc?: string
}

export function AuthLayout({
  children,
  title,
  description,
  quote,
  author,
  imageSrc = "/library-cartoon.png",
}: AuthLayoutProps) {
  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left Panel (Desktop Only) */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900" />
        {/* Background Image - Anchored to bottom */}
        <Image
          src={imageSrc}
          alt="Auth Background"
          fill
          className="absolute inset-0 object-cover object-bottom opacity-80 select-none"
          priority
        />
        
        {/* Top Content Container */}
        <div className="relative z-20 flex flex-col gap-8 w-full max-w-lg">
            {/* Logo Area - Minimalist Glass */}
            <div className="flex items-center select-none">
            <Link 
                href="/"
                className="flex items-center gap-3 transition-all hover:opacity-80 group"
            >
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm group-hover:bg-white/20 transition-colors">
                    <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-white drop-shadow-md">
                    Library System
                </span>
            </Link>
            </div>

            {/* Quote Area - Compact Glass Card */}
            <div className="select-none">
            <blockquote className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
                <div className="relative z-10 space-y-2">
                    <p className="text-base font-medium leading-snug text-white/90 drop-shadow-sm">
                    &ldquo;{quote}&rdquo;
                    </p>
                    <footer className="flex items-center gap-2 pt-1">
                        <div className="h-px w-4 bg-white/30" />
                        <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">
                            {author}
                        </span>
                    </footer>
                </div>
            </blockquote>
            </div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="relative h-full flex items-center justify-center p-4 lg:p-8">
        <div className="relative mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] z-10">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex flex-col space-y-2 text-center lg:hidden select-none">
            <Link href="/" className="flex items-center justify-center gap-2 font-semibold">
              <BookOpen className="h-6 w-6 text-primary" />
              Library System
            </Link>
          </div>

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          
          {children}

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
