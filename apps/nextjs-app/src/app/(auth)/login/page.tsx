import { Metadata } from "next"
import { LoginForm } from "@/features/auth/components/login-form"
import { AuthLayout } from "@/features/auth/auth-layout"

export const metadata: Metadata = {
  title: "Login - Library System",
  description: "Sign in to your Library System account to manage your loans, browse books, and view your history.",
  openGraph: {
    title: "Login - Library System",
    description: "Sign in to your Library System account to manage your loans, browse books, and view your history.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Login - Library System",
    description: "Sign in to your Library System account to manage your loans, browse books, and view your history.",
  },
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your email to sign in to your account"
      quote="A library is not a luxury but one of the necessities of life."
      author="Henry Ward Beecher"
    >
      <LoginForm />
    </AuthLayout>
  )
}
