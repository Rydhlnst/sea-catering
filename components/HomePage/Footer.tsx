"use client";

import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  TwitterLogo,
} from "phosphor-react";
import React from "react";

interface FooterProps {
  logo?: {
    url: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
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
];

const defaultSocialLinks = [
  { icon: <InstagramLogo className="size-5" />, href: "#", label: "Instagram" },
  { icon: <FacebookLogo className="size-5" />, href: "#", label: "Facebook" },
  { icon: <TwitterLogo className="size-5" />, href: "#", label: "Twitter" },
  { icon: <LinkedinLogo className="size-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms & Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

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
    <footer className="bg-primary text-primary-foreground pt-0">
      {/* Footer Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-start">
            <div className="flex flex-col gap-6 lg:w-1/2">
              {/* Logo & Description */}
              <div className="flex items-center gap-3">
                <a href={logo.url} className="flex items-center gap-2">
                  <span className="text-xl font-bold">{logo.title}</span>
                </a>
              </div>
              <p className="text-sm md:text-base text-primary-foreground/80 max-w-md">
                {description}
              </p>
              <ul className="flex items-center space-x-6">
                {socialLinks.map((social, idx) => (
                  <li key={idx} className="hover:text-white transition">
                    <a href={social.href} aria-label={social.label}>
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div className="grid w-full gap-6 md:grid-cols-3 lg:w-1/2 lg:gap-20">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 text-base md:text-lg font-semibold">
                    {section.title}
                  </h3>
                  <ul className="space-y-3 text-sm md:text-base text-primary-foreground/80">
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

          {/* Footer Bottom */}
          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-foreground pt-8 text-xs md:text-sm font-medium md:flex-row md:items-center text-primary-foreground/60">
            <p className="order-2 md:order-1">{copyright}</p>
            <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row md:gap-6">
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
  );
};

export default Footer;
