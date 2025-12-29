"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { BookCreateRequest, BookDto, CategoryControllerService, AuthorControllerService, BookUpdateRequest } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { AsyncCombobox } from "@/components/ui/async-combobox"
import { AsyncMultiCombobox } from "@/components/ui/async-multi-combobox"

const bookFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  isbn: z.string().min(10, {
    message: "ISBN must be at least 10 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  coverImageUrl: z.string().url({
    message: "Please enter a valid URL.",
  }).optional().or(z.literal("")),
  price: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  publisher: z.string().optional(),
  publishedDate: z.string().optional(),
  pageCount: z.coerce.number().min(1).optional(),
  language: z.string().optional(),
  format: z.string().optional(),
  categoryId: z.coerce.number({
    required_error: "Please select a category.",
  }),
  authorIds: z.array(z.coerce.number()).min(1, {
    message: "Please select at least one author.",
  }),
})

type BookFormValues = z.infer<typeof bookFormSchema>

interface BookFormProps {
  initialData?: BookDto
  onSubmit: (data: BookCreateRequest | BookUpdateRequest) => void
  isLoading?: boolean
}

export function BookForm({ initialData, onSubmit, isLoading }: BookFormProps) {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      isbn: initialData?.isbn || "",
      description: initialData?.description || "",
      coverImageUrl: initialData?.coverImageUrl || "",
      price: initialData?.price || 0,
      publisher: initialData?.publisher || "",
      publishedDate: initialData?.publishedDate || "",
      pageCount: initialData?.pageCount || undefined,
      language: initialData?.language || "",
      format: initialData?.format || "",
      categoryId: initialData?.category?.id || undefined,
      authorIds: initialData?.authors?.map(a => a.id!) || [],
    },
  })

  function handleSubmit(data: BookFormValues) {
    const payload = {
      ...data,
      coverImageUrl: data.coverImageUrl || "",
      publisher: data.publisher || undefined,
      publishedDate: data.publishedDate || undefined,
      pageCount: data.pageCount || undefined,
      language: data.language || undefined,
      format: data.format || undefined,
    }
    onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input placeholder="ISBN-13" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <AsyncCombobox
                    value={field.value}
                    onChange={(val) => field.onChange(Number(val))}
                    fetchOptions={async (search) => {
                      const res = await CategoryControllerService.getCategories({name: search})
                      return res.data?.content || []
                    }}
                    mapOption={(item) => ({
                      value: item.id!,
                      label: item.name!
                    })}
                    placeholder="Select category"
                    searchPlaceholder="Search category..."
                    initialData={initialData?.category ? [initialData.category] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorIds"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Authors</FormLabel>
                <FormControl>
                  <AsyncMultiCombobox
                    value={field.value}
                    onChange={(val) => field.onChange(val.map(Number))}
                    fetchOptions={async (search) => {
                      const res = await AuthorControllerService.getAllAuthors({name: search})
                      return res.data?.content || []
                    }}
                    mapOption={(item) => ({
                      value: item.id!,
                      label: item.name!
                    })}
                    placeholder="Select authors"
                    searchPlaceholder="Search authors..."
                    initialData={initialData?.authors || []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pageCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Count</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publisher"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publisher</FormLabel>
                <FormControl>
                  <Input placeholder="Publisher name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publishedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Published Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. English" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Format</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Hardcover" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Book description" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Book" : "Create Book"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
