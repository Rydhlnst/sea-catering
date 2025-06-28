import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    domains: ["deifkwefumgah.cloudfront.net", "source.unsplash.com"], // <- tambahkan domain ini
  },
};

module.exports = nextConfig;
