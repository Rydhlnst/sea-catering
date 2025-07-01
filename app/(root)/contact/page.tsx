"use client"

import { Mailbox, MapPin, Phone } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function ContactSection() {
  const contacts = [
    {
      title: "Email",
      description: "Feel free to drop us an email anytime.",
      value: "support@seacatering.com",
      icon: <Mailbox className="text-primary w-5 h-5" />,
    },
    {
      title: "Office",
      description: "Visit us or send mail to our head office.",
      value: "Jl. Sehat No. 17, Bandung, Indonesia",
      icon: <MapPin className="text-primary w-5 h-5" />,
    },
    {
      title: "Phone",
      description: "Available Monday to Friday, 9AM - 5PM (WIB).",
      value: "+62 812-3456-789",
      icon: <Phone className="text-primary w-5 h-5" />,
    },
  ]

  return (
    <section className="py-32 md:py-20 bg-background max-w-7xl min-h-screen mx-auto flex items-center justify-center">
      <div className="container max-w-7xl mx-auto px-4 flex flex-col gap-12">
        {/* Header Section */}
        <div>
          <h2 className="text-3xl lg:text-5xl font-bold">Get in Touch</h2>
          <p className="text-muted-foreground mt-2">
            We&apos;re here to help—reach out with any questions or feedback.
          </p>
        </div>

        {/* Grid Section */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Form */}
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your Email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} placeholder="Type Your Message..." />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">
                I accept the <span className="underline cursor-pointer">Terms</span>
              </Label>
            </div>

            <Button type="submit" className="w-full bg-primary text-white">
              Submit
            </Button>
          </form>

          {/* Right: Contact Info (Grid) */}
          <div className="grid grid-cols-2 gap-6">
            {contacts.map((contact, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="bg-primary/10 p-2 rounded-full">{contact.icon}</div>
                <div>
                  <h4 className="font-semibold text-base">{contact.title}</h4>
                  <p className="text-muted-foreground text-sm">{contact.description}</p>
                  <p className="font-bold">{contact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
