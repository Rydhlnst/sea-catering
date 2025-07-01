"use client"

import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  TwitterLogo,
} from "phosphor-react"
import React from "react"

interface FooterProps {
  logo?: {
    url: string
    alt: string
    title: string
  }
  sections?: Array<{
    title: string
    links: Array<{ name: string; href: string }>
  }>
  description?: string
  socialLinks?: Array<{
    icon: React.ReactElement
    href: string
    label: string
  }>
  copyright?: string
  legalLinks?: Array<{
    name: string
    href: string
  }>
}

const defaultSections = [
  {
    title: "Services",
    links: [
      { name: "Subscription Plans", href: "#" },
      { name: "Daily Menu", href: "#" },
      { name: "Nutrition Consulting", href: "#" },
      { name: "Testimonials", href: "#" },
    ],
  },
  {
    title: "SEA Catering",
    links: [
      { name: "About Us", href: "#" },
      { name: "Our Team", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "Help Center", href: "#" },
      { name: "How to Subscribe", href: "#" },
      { name: "Refund Policy", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
]

const defaultSocialLinks = [
  { icon: <InstagramLogo className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FacebookLogo className="size-5" />, href: "#", label: "Facebook" },
  { icon: <TwitterLogo className="size-5" />, href: "#", label: "Twitter" },
  { icon: <LinkedinLogo className="size-5" />, href: "#", label: "LinkedIn" },
]

const defaultLegalLinks = [
  { name: "Terms & Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
]

const Footer = ({
  logo = {
    url: "/",
    alt: "SEA Catering Logo",
    title: "SEA Catering",
  },
  sections = defaultSections,
  description = "Healthy catering with flexible, nutritious, and practical meal options for everyone.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2024 SEA Catering. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: FooterProps) => {
  return (
    <footer className="bg-primary text-primary-foreground overflow-x-hidden">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
            {/* Logo & Description */}
            <div className="flex flex-col gap-6 lg:w-1/2">
              <a href={logo.url} className="flex items-center gap-2">
                <span className="text-xl font-bold">{logo.title}</span>
              </a>
              <p className="text-sm sm:text-base text-primary-foreground/80 max-w-md leading-relaxed">
                {description}
              </p>
              <ul className="flex items-center space-x-5">
                {socialLinks.map((social, idx) => (
                  <li key={idx} className="hover:text-white transition">
                    <a href={social.href} aria-label={social.label}>
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Sections */}
            <div className="grid w-full gap-10 sm:grid-cols-2 md:grid-cols-3 lg:w-1/2 lg:gap-20">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 text-base sm:text-lg font-semibold">
                    {section.title}
                  </h3>
                  <ul className="space-y-3 text-sm sm:text-base text-primary-foreground/80">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx} className="hover:text-white font-medium">
                        <a href={link.href}>{link.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 flex flex-col gap-4 border-t border-foreground pt-8 text-xs sm:text-sm font-medium sm:flex-row sm:justify-between sm:items-center text-primary-foreground/60">
            <p className="order-2 sm:order-1">{copyright}</p>
            <ul className="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row sm:gap-6">
              {legalLinks.map((link, idx) => (
                <li key={idx} className="hover:text-white">
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </footer>
  )
}

export default Footer
