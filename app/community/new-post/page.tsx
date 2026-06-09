"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { usePostMessageMutation } from "@/services/community/client"
import { getApiErrorMessage } from "@/services/errors"

const formSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  tags: z.string().optional(),
})

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const postMessageMutation = usePostMessageMutation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await postMessageMutation.mutateAsync({
        content: `${values.title}\n\n${values.content}`,
      })

      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      })

      router.push("/community")
    } catch (error) {
      toast({
        title: "Post creation failed",
        description: getApiErrorMessage(error, "There was a problem creating your post. Please try again."),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>Share your experiences, ask questions, or start a discussion.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a descriptive title" {...field} />
                    </FormControl>
                    <FormDescription>Keep it clear and specific.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your thoughts, experiences, or questions..."
                        className="min-h-[200px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tanzania, Routes, Tips (comma separated)" {...field} />
                    </FormControl>
                    <FormDescription>Add relevant tags to help others find your post.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.push("/community")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={postMessageMutation.isPending}>
                  {postMessageMutation.isPending ? "Publishing..." : "Publish Post"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
