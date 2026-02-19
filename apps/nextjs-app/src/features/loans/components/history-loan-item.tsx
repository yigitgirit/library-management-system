"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"
import { LoanUserSummaryDto, FineStatus } from "../types/loan"
import Image from "next/image"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface HistoryLoanItemProps {
  loan: LoanUserSummaryDto
}

export function HistoryLoanItem({ loan }: HistoryLoanItemProps) {
    // Check if there are any unpaid fines
    const unpaidFines = loan.fines?.filter(fine => fine.status === FineStatus.UNPAID) || [];
    const hasUnpaidFines = unpaidFines.length > 0;
    
    // Determine styles and text based on fine status
    const accordionStyle = hasUnpaidFines 
        ? "border-destructive/20 bg-destructive/5" 
        : "border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900";
        
    const textStyle = hasUnpaidFines 
        ? "text-destructive" 
        : "text-orange-600 dark:text-orange-400";
        
    // If there are unpaid fines, show count of UNPAID fines. Otherwise show TOTAL count.
    const countText = hasUnpaidFines ? unpaidFines.length : loan.fines?.length || 0;
    const headerText = hasUnpaidFines ? "Outstanding Fines" : "Fine History";
    const Icon = hasUnpaidFines ? AlertCircle : CheckCircle2;

    // Calculate amounts
    const unpaidAmount = unpaidFines.reduce((sum, f) => sum + (f.amount || 0), 0);
    const totalHistoryAmount = loan.fines?.reduce((sum, f) => sum + (f.amount || 0), 0) || 0;

    // Determine which amount and label to show
    const displayAmount = hasUnpaidFines ? unpaidAmount : totalHistoryAmount;
    const amountLabel = hasUnpaidFines ? "Due" : "Total";

    return (
        <div className="flex flex-col py-4 border-b last:border-0">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-12 bg-muted relative rounded overflow-hidden shrink-0 hidden sm:block">
                         {loan.bookCoverUrl && (
                            <Image src={loan.bookCoverUrl} alt="" fill className="object-cover" />
                         )}
                    </div>
                    <div>
                        <p className="font-medium line-clamp-1">{loan.bookTitle}</p>
                        <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                            <p>Borrowed: {formatDate(loan.loanDate)}</p>
                            <p>Returned: {formatDate(loan.returnDate)}</p>
                        </div>
                    </div>
                </div>
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                    {loan.status}
                </Badge>
            </div>
            
            {loan.fines && loan.fines.length > 0 && (
                <div className="mt-4">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="fines" className={cn("border-b-0 rounded-md px-2", accordionStyle)}>
                            <AccordionTrigger className="py-2 hover:no-underline">
                                <div className={cn("flex items-center gap-2 text-xs font-semibold w-full", textStyle)}>
                                    <Icon className="h-3.5 w-3.5" />
                                    <span>{headerText} ({countText})</span>
                                    <span className="ml-auto mr-2 text-[10px] font-bold">
                                        {amountLabel}: ${displayAmount.toFixed(2)}
                                    </span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pb-2 pt-1">
                                    {loan.fines.map((fine) => (
                                        <div key={fine.id} className="p-2 text-xs bg-white dark:bg-background rounded-md border shadow-sm">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium text-foreground">{fine.reason || "Fine"}</span>
                                                <span className="font-bold">${fine.amount?.toFixed(2)}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 text-[10px] text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>Issued: {formatDate(fine.fineDate)}</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1 pt-1 border-t border-dashed">
                                                    {fine.status === FineStatus.UNPAID && (
                                                        <>
                                                            <Badge variant="destructive" className="h-4 px-1.5 text-[10px]">Unpaid</Badge>
                                                            <Button 
                                                                size="sm" 
                                                                className="h-5 text-[10px] gap-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                                asChild
                                                            >
                                                                <Link href={`/payment?fineId=${fine.id}`}>
                                                                    <CreditCard className="h-2.5 w-2.5" />
                                                                    Pay
                                                                </Link>
                                                            </Button>
                                                        </>
                                                    )}
                                                    {fine.status === FineStatus.PAID && (
                                                        <div className="flex items-center gap-1">
                                                            <Badge variant="outline" className="h-4 px-1.5 text-[10px] border-green-600 text-green-600 bg-green-50 dark:bg-green-900/20">Paid</Badge>
                                                            <span className="text-[10px]">on {formatDate(fine.paymentDate)}</span>
                                                        </div>
                                                    )}
                                                    {fine.status === FineStatus.WAIVED && (
                                                        <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">Waived</Badge>
                                                    )}
                                                    {fine.status === FineStatus.CANCELLED && (
                                                        <Badge variant="outline" className="h-4 px-1.5 text-[10px]">Cancelled</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            )}
        </div>
    )
}