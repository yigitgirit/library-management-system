import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="flex-1 container mx-auto max-w-5xl py-12 px-4 md:px-8">
        <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Info */}
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
                    <p className="text-xl text-muted-foreground">
                        Have questions? We&#39;d love to hear from you. Send us a message and we&#39;ll respond as soon as possible.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Visit Us</h3>
                            <p className="text-muted-foreground">123 Library Lane<br/>Booktown, BK 12345</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Email Us</h3>
                            <p className="text-muted-foreground">support@library.com</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h3 className="font-semibold">Call Us</h3>
                            <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Send a Message</CardTitle>
                    <CardDescription>Fill out the form below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" placeholder="John" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="john@example.com" type="email" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="How can we help you?" className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </CardContent>
            </Card>

        </div>
      </main>
    </div>
  )
}
