"use client"

import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react"
import Link from "next/link"

const ContactSection = () => {
  return (
    <section className="bg-background py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-14">
          <h1 className="mt-2 mb-3 text-3xl font-semibold text-balance md:text-4xl">
            Get in Touch
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Contact SEA Catering for inquiries, subscriptions, or partnerships. We’re happy to assist you with your healthy lifestyle journey.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent text-foreground">
              <EnvelopeSimple size={24} weight="bold" />
            </span>
            <p className="mb-2 text-lg font-semibold">Email</p>
            <p className="mb-3 text-muted-foreground">
              Feel free to drop us an email anytime.
            </p>
            <a
              href="mailto:support@seacatering.com"
              className="font-semibold hover:underline"
            >
              support@seacatering.com
            </a>
          </div>
          <div>
            <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent text-foreground">
              <MapPin size={24} weight="bold" />
            </span>
            <p className="mb-2 text-lg font-semibold">Office</p>
            <p className="mb-3 text-muted-foreground">
              Visit us or send mail to our head office.
            </p>
            <span className="font-semibold">
              Jl. Sehat No. 17, Bandung, Indonesia
            </span>
          </div>
          <div>
            <span className="mb-3 flex size-12 flex-col items-center justify-center rounded-full bg-accent text-foreground">
              <Phone size={24} weight="bold" />
            </span>
            <p className="mb-2 text-lg font-semibold">Phone</p>
            <p className="mb-3 text-muted-foreground">
              Available Monday to Friday, 9AM - 5PM (WIB).
            </p>
            <Link
              href="tel:081271442601"
              className="font-semibold hover:underline"
            >
              <div className="flex flex-row gap-3">
                <p>Brian</p>
                <p>
                  +62 812-3456-789 
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
