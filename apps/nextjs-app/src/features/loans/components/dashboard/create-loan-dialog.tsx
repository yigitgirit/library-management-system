"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { CreateLoanForm } from "./create-loan-form"

export function CreateLoanDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-9">
          <Plus className="mr-2 h-4 w-4" /> Create Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Loan</DialogTitle>
          <DialogDescription>
            Select a user and a book copy to create a new loan record.
          </DialogDescription>
        </DialogHeader>
        <CreateLoanForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
