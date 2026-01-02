"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "How long can I borrow a book?",
    answer: "Our standard loan period is 14 days. You can check the specific due date for each loan in your 'My Loans' section."
  },
  {
    question: "What happens if I return a book late?",
    answer: "A fine is applied for each day a book is overdue. The amount is 1.5 units per day, but this can increase if you have a history of late returns. The fine is capped and will not exceed the book's value."
  },
  {
    question: "How do I receive notifications?",
    answer: "By default, you receive notifications via Email and SMS for critical events like overdue books. You can customize your notification preferences for each category (e.g., 'Due Soon', 'Fine Issued') in your profile settings."
  },
  {
    question: "Can I renew my loan?",
    answer: "Yes, you can renew a loan once, provided no one else has reserved the book. This feature will be available in your 'My Loans' section."
  },
  {
    question: "What is the maximum number of books I can borrow?",
    answer: "You can have up to 50 active loans at one time, as long as you do not have a significant amount of unpaid fines."
  },
  {
    question: "How is my data protected?",
    answer: "We take your privacy seriously. All communication is encrypted, and your personal data is stored securely. We only use your reading history to provide you with better recommendations, and you can opt-out of this feature."
  }
]

export function FaqSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions about our library system.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
