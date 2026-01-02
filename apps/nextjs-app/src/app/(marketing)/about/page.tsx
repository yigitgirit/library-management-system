import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
    BookOpen, 
    Users, 
    Globe, 
    Award, 
    LucideIcon, 
    Heart, 
    Lightbulb, 
    Shield 
} from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">About Us</h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    We are dedicated to providing access to knowledge and fostering a community of lifelong learners.
                </p>
            </div>
        </section>

        <div className="container mx-auto max-w-5xl py-12 px-4 md:px-8 space-y-24">
            
            {/* Mission */}
            <section className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Our Mission</div>
                    <h2 className="text-3xl font-bold tracking-tight">Empowering Minds, Connecting Communities</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Our mission is to empower individuals through free and open access to information, ideas, and culture. We believe that libraries are essential for a democratic society and that everyone deserves the opportunity to learn and grow.
                    </p>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl bg-muted shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                        <BookOpen className="h-24 w-24 text-primary/20" />
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatCard icon={BookOpen} value="50k+" label="Books" />
                <StatCard icon={Users} value="10k+" label="Members" />
                <StatCard icon={Globe} value="24/7" label="Online Access" />
                <StatCard icon={Award} value="100+" label="Years of Service" />
            </section>

            {/* Values */}
            <section className="space-y-8">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Our Core Values</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    <ValueCard 
                        icon={Heart} 
                        title="Inclusivity" 
                        description="We welcome everyone and strive to create a safe, accessible space for all members of our community." 
                    />
                    <ValueCard 
                        icon={Lightbulb} 
                        title="Innovation" 
                        description="We embrace new technologies and ideas to better serve our patrons in a rapidly changing world." 
                    />
                    <ValueCard 
                        icon={Shield} 
                        title="Integrity" 
                        description="We are committed to intellectual freedom, privacy, and the ethical stewardship of information." 
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-2xl bg-primary text-primary-foreground p-8 md:p-12 text-center space-y-6">
                <h2 className="text-3xl font-bold">Ready to start reading?</h2>
                <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
                    Join thousands of members and get instant access to our vast collection of books and resources.
                </p>
                <div className="flex justify-center gap-4">
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/books">Browse Catalog</Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                        <Link href="/register">Become a Member</Link>
                    </Button>
                </div>
            </section>

        </div>
      </main>
    </div>
  )
}

interface StatCardProps {
    icon: LucideIcon
    value: string
    label: string
}

function StatCard({ icon: Icon, value, label }: StatCardProps) {
    return (
        <Card className="text-center p-6 border-none shadow-none bg-muted/50">
            <CardContent className="pt-6 space-y-2">
                <Icon className="h-8 w-8 mx-auto text-primary" />
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
            </CardContent>
        </Card>
    )
}

interface ValueCardProps {
    icon: LucideIcon
    title: string
    description: string
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
    return (
        <Card className="h-full">
            <CardContent className="pt-6 space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}