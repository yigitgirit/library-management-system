import { Metadata } from "next"
import { RegisterForm } from "@/features/auth/components/register-form"
import { AuthLayout } from "@/features/auth/auth-layout"

export const metadata: Metadata = {
  title: "Register - Library System",
  description: "Create a new Library System account to start borrowing books and accessing our digital collection.",
  openGraph: {
    title: "Register - Library System",
    description: "Create a new Library System account to start borrowing books and accessing our digital collection.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Register - Library System",
    description: "Create a new Library System account to start borrowing books and accessing our digital collection.",
  },
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      description="Enter your email below to create your account"
      quote="The only thing that you absolutely have to know, is the location of the library."
      author="Albert Einstein"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
