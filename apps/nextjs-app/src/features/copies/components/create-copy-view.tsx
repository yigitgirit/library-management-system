"use client"

import { CreateCopyForm } from "./dashboard/create-copy-form"

export function CreateCopyView() {
  return (
    <div className="w-full">
      <CreateCopyForm onSuccess={() => {}} />
    </div>
  )
}
