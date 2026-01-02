import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface AccessDeniedProps {
  title?: string
  description?: string
  returnUrl?: string
}

export function AccessDenied({ 
  title = "Access Denied", 
  description = "You need to be signed in to view this page.",
  returnUrl = "/login"
}: AccessDeniedProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 bg-muted p-4 rounded-full">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-lg mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please sign in with your account to continue.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button variant="outline" asChild>
fix:            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href={returnUrl}>Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
