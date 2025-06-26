import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Hero47Props {
  heading?: string;
  subheading?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  leftImageSrc?: string;
  leftImageAlt?: string;
}

const HeroSection = ({
  heading = "HEALTHY",
  subheading = "MEALS",
  description = "From fresh menu choices to customizable nutritious meals, we deliver the best healthy dishes straight to your doorstep across Indonesia.",
  primaryButtonText = "View Menu",
  primaryButtonUrl = "/menu",
  secondaryButtonText = "Subscribe",
  secondaryButtonUrl = "/subscription",
  leftImageSrc = "/salad.svg",
  leftImageAlt = "Salad",
}: Hero47Props) => {
  return (
    <section className="relative min-h-screen bg-background text-foreground pt-36 pb-40 lg:pb-20 overflow-hidden">
      <div className="container max-w-7xl mx-auto relative z-20 grid lg:grid-cols-2 items-center gap-10">
        {/* Left Side: Salad Image */}
        <div className="flex justify-center items-center h-full">
          <Image
            src={leftImageSrc}
            alt={leftImageAlt}
            width={600}
            height={600}
            priority
            className="object-contain w-full max-w-[500px] opacity-90"
          />
        </div>

        {/* Right Side: Text */}
        <div className="flex flex-col items-center lg:items-end text-center lg:text-right gap-8">
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] xl:text-[10rem] font-bold leading-none tracking-tighter font-changaOne uppercase">
            <span className="block text-foreground">{heading}</span>
            <span className="block text-primary -mt-4 sm:-mt-6 lg:-mt-10">
              {subheading}
            </span>
          </h1>

          <div className="flex justify-center lg:justify-end mt-4">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <Link href={primaryButtonUrl}>
                <span className="flex items-center gap-2">
                  {primaryButtonText}
                  <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            </Button>
          </div>

          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl lg:max-w-md ml-auto mt-8 font-dmSans">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm py-6 px-4 md:px-8">
        <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex items-center -space-x-2">
              <div className="size-10 rounded-full bg-gray-300 border-2 border-background flex items-center justify-center text-xs font-semibold text-gray-700">JL</div>
              <div className="size-10 rounded-full bg-gray-400 border-2 border-background flex items-center justify-center text-xs font-semibold text-gray-700">KS</div>
              <div className="size-10 rounded-full bg-gray-500 border-2 border-background flex items-center justify-center text-xs font-semibold text-gray-700">AM</div>
            </div>
            <p className="text-foreground text-sm font-dmSans">
              <span className="font-bold">2.5K+</span> Satisfied Customers
            </p>
            <div className="flex items-center gap-1 ml-4 text-primary">
              <span className="text-xl font-bold">4.9</span>
              <span className="text-xl">★★★★★</span>
            </div>
            <p className="text-foreground text-sm font-dmSans ml-4">
              <span className="font-bold">50+</span> Famous Healthy Meals
            </p>
          </div>

          <Button asChild variant="secondary" size="lg" className="rounded-full px-8 py-6 text-lg font-bold shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Link href={secondaryButtonUrl}>
              <span className="font-rubikMono">{secondaryButtonText}</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
