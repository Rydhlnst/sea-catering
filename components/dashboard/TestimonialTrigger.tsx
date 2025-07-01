"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquarePlus } from "lucide-react";
import { TestimonialForm } from "./TestimonialForm";

// This component receives the subscriptionId
interface TestimonialTriggerProps {
  subscriptionId: string;
}

export function TestimonialTrigger({ subscriptionId }: TestimonialTriggerProps) {
  // State to control dialog visibility and allow it to close from inside the form
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Leave a Testimonial
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share Your Experience</DialogTitle>
          <DialogDescription>
            Your feedback helps us grow and improve our service.
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm
          subscriptionId={subscriptionId}
          onSuccess={() => setOpen(false)} // Close dialog after success
        />
      </DialogContent>
    </Dialog>
  );
}
