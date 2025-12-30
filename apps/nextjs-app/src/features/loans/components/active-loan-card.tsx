"use client"

import { Card, CardContent } from "@/features/common/components/ui/card"
import { Badge } from "@/features/common/components/ui/badge"
import { Calendar, Clock, BookOpen } from "lucide-react"
import { LoanUserSummaryDto } from "@/lib/api"
import Image from "next/image"
import { format, differenceInDays, parseISO } from "date-fns"
import { formatDate } from "@/lib/utils"

interface ActiveLoanCardProps {
  loan: LoanUserSummaryDto
}

export function ActiveLoanCard({ loan }: ActiveLoanCardProps) {
    const dueDate = loan.dueDate ? parseISO(loan.dueDate) : new Date()
    const daysLeft = differenceInDays(dueDate, new Date())
    const isOverdue = loan.status === LoanUserSummaryDto.status.OVERDUE || daysLeft < 0
    const isDueSoon = !isOverdue && daysLeft >= 0 && daysLeft <= 3

    return (
        <Card className={`overflow-hidden border-l-4 transition-all hover:shadow-md ${isOverdue ? 'border-l-destructive' : isDueSoon ? 'border-l-orange-500' : 'border-l-green-500'}`}>
            <div className="flex h-full">
                {/* Book Cover */}
                <div className="relative w-32 sm:w-40 bg-muted shrink-0">
                    {loan.bookCoverUrl ? (
                        <Image 
                            src={loan.bookCoverUrl} 
                            alt={loan.bookTitle || "Book Cover"} 
                            fill 
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <CardContent className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <h3 className="font-semibold text-lg line-clamp-2" title={loan.bookTitle}>
                                {loan.bookTitle}
                            </h3>
                            {isOverdue && <Badge variant="destructive" className="shrink-0">Overdue</Badge>}
                            {isDueSoon && <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 shrink-0">Due Soon</Badge>}
                        </div>
                        
                        <div className="space-y-3 mt-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Borrowed</span>
                                </div>
                                <span className="font-medium">{formatDate(loan.loanDate)}</span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Due Date</span>
                                </div>
                                <span className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                                    {formatDate(loan.dueDate)}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm pt-2 border-t">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Status</span>
                                </div>
                                <span className={`font-medium ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>
                                    {isOverdue 
                                        ? `${Math.abs(daysLeft)} days late` 
                                        : daysLeft === 0 
                                            ? "Return today" 
                                            : `${daysLeft} days remaining`}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}
