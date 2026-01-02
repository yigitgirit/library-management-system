import { AppError, ErrorCodes } from "@/types/api"
import { AlertCircle, FileWarning, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface ApiErrorStateProps {
  error: AppError | Error | null
  onRetry?: () => void
  className?: string
}

export function ApiErrorState({ error, onRetry, className }: ApiErrorStateProps) {
  if (!error) return null

  const isAppError = error instanceof AppError
  const code = isAppError ? error.code : "UNKNOWN_ERROR"
  const message = error.message || "Something went wrong"

  // Customize UI based on error code
  const getErrorContent = () => {
    switch (code) {
      case ErrorCodes.RESOURCE_NOT_FOUND:
      case ErrorCodes.BOOK_NOT_FOUND:
      case ErrorCodes.AUTHOR_NOT_FOUND:
      case ErrorCodes.CATEGORY_NOT_FOUND:
      case ErrorCodes.COPY_NOT_FOUND:
      case ErrorCodes.USER_NOT_FOUND:
      case ErrorCodes.ENDPOINT_NOT_FOUND:
        return {
          icon: FileWarning,
          title: "Not Found",
          description: message,
          variant: "default" as const,
        }
      case ErrorCodes.UNAUTHORIZED:
      case ErrorCodes.FORBIDDEN:
      case ErrorCodes.USER_ACCOUNT_LOCKED:
      case ErrorCodes.TOKEN_EXPIRED:
      case ErrorCodes.REFRESH_TOKEN_EXPIRED:
        return {
          icon: ShieldAlert,
          title: "Access Denied",
          description: "You do not have permission to view this resource.",
          variant: "destructive" as const,
        }
      default:
        return {
          icon: AlertCircle,
          title: "Error",
          description: message,
          variant: "destructive" as const,
        }
    }
  }

  const content = getErrorContent()
  const Icon = content.icon

  return (
    <Alert variant={content.variant} className={className}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{content.title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-4">
        <p>{content.description}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="w-fit">
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
