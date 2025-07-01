import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinalCTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  items?: string[];
}

// Default list of benefits shown in CTA
const defaultItems = [
  "Flexible Subscription Packages",
  "Customizable for Your Diet",
  "Fresh Ingredients Daily",
  "Nationwide Delivery in Indonesia",
  "Support from Professional Nutritionists",
];

const FinalCTASection = ({
  title = "Easy Subscription, Healthier Life",
  description = "Join thousands of our happy customers who have experienced the benefits of healthy eating. Choose a package that fits your needs and enjoy nutritious meals without the hassle.",
  buttonText = "Subscribe Now",
  buttonUrl = "/subscription",
  items = defaultItems,
}: FinalCTASectionProps) => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="flex justify-center">
          <div className="w-full">
            {/* CTA Card */}
            <div className="flex flex-col items-start justify-between gap-8 rounded-lg bg-muted px-6 py-10 md:flex-row lg:px-20 lg:py-16">
              {/* Left Text */}
              <div className="md:w-1/2">
                <h4 className="mb-1 text-2xl font-bold md:text-3xl">{title}</h4>
                <p className="text-muted-foreground">{description}</p>
                <Button className="mt-6" asChild>
                  <a href={buttonUrl}>
                    {buttonText} <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
              </div>
              {/* Right Features List */}
              <div className="md:w-1/3">
                <ul className="flex flex-col space-y-2 text-sm font-medium">
                  {items.map((item, idx) => (
                    <li className="flex items-center" key={idx}>
                      <Check className="mr-4 size-4 flex-shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
