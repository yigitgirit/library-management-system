"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { Author } from "@/features/authors/types/author"
import { AuthorCreateInput, AuthorUpdateInput, authorCreateSchema } from "@/features/authors/schemas/author"

interface AuthorFormProps {
  initialData?: Author
  onSubmit: (data: AuthorCreateInput | AuthorUpdateInput) => void
  isLoading?: boolean
}

export function AuthorForm({ initialData, onSubmit, isLoading }: AuthorFormProps) {
  const form = useForm<AuthorCreateInput>({
    resolver: zodResolver(authorCreateSchema),
    defaultValues: {
      name: initialData?.name || "",
      biography: initialData?.biography || "",
      birthDate: initialData?.birthDate || "",
      deathDate: initialData?.deathDate || "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="deathDate"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Death Date</FormLabel>
                <FormControl>
                    <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Author biography" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Author" : "Create Author"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
