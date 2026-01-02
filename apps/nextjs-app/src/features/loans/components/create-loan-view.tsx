"use client"

import { CreateLoanForm } from "./dashboard/create-loan-form"

export function CreateLoanView() {
  return (
    <div className="w-full">
      <CreateLoanForm onSuccess={() => {}} />
    </div>
  )
}
