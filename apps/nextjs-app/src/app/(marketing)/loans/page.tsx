import { LoansView } from "@/features/loans/loans-view"
import { getCurrentUser } from "@/lib/auth/auth-utils"
import { cookies } from "next/headers"
import { AccessDenied } from "@/features/auth/access-denied"
import { OpenAPI, LoanUserSummaryDto } from "@/lib/api"
import { request as apiRequest } from "@/lib/api/core/request"
import { BookOpenText, History } from "lucide-react"

// Configure OpenAPI Base URL globally (safe as it's constant)
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default async function LoansPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    return <AccessDenied description="You need to be signed in to view your loans." />;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return <AccessDenied description="Session expired. Please sign in again." />;
  }

  let allLoans: LoanUserSummaryDto[] = [];

  try {
    // Create a request-specific configuration to avoid singleton race conditions
    const requestConfig = {
      ...OpenAPI,
      TOKEN: token,
    };

    // Use the core request function directly instead of the static service wrapper
    const response = await apiRequest(requestConfig, {
      method: 'GET',
      url: '/api/loans/my-loans',
      query: {
        size: 1000,
        sort: ["loanDate,desc"]
      },
    });

    // The generated request function returns the body directly on success
    // Type assertion might be needed if the return type isn't inferred correctly
    // based on the generated code structure, response is the body.
    // However, looking at LoanControllerService, it expects ApiResponsePagedDataLoanUserSummaryDto
    const data = response as any; // Temporary cast to avoid strict type issues with the manual call

    if (data && data.data && data.data.content) {
      allLoans = data.data.content;
    }
  } catch (error) {
    console.error("Error fetching loans:", error);
  }

  // Filter Active Loans (ACTIVE + OVERDUE)
  const activeLoans = allLoans.filter(loan =>
    loan.status === LoanUserSummaryDto.status.ACTIVE || loan.status === LoanUserSummaryDto.status.OVERDUE
  );
  
  // Filter History Loans (Everything else)
  const historyLoans = allLoans.filter(loan => 
    loan.status !== LoanUserSummaryDto.status.ACTIVE && loan.status !== LoanUserSummaryDto.status.OVERDUE
  );

  return (
    <div className="flex min-h-screen flex-col bg-muted/5">
      
      <main className="flex-1 container mx-auto max-w-5xl py-10 px-4 md:px-8">
        <div className="flex flex-col space-y-8">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Library</h1>
                    <p className="text-muted-foreground mt-1">
                        Track your reading journey, manage active loans, and view your history.
                    </p>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground bg-background p-3 rounded-lg border shadow-sm">
                    <div className="flex items-center gap-2">
                        <BookOpenText className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{activeLoans.length}</span> Active
                    </div>
                    <div className="w-px h-4 bg-border"></div>
                    <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{historyLoans.length}</span> Returned
                    </div>
                </div>
            </div>

            <LoansView activeLoans={activeLoans} historyLoans={historyLoans} />

        </div>
      </main>
    </div>
  )
}
