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

// Komponen ini menerima subscriptionId
interface TestimonialTriggerProps {
  subscriptionId: string;
}

export function TestimonialTrigger({ subscriptionId }: TestimonialTriggerProps) {
  // State untuk mengontrol dialog agar bisa ditutup dari dalam form
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Beri Testimoni
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bagikan Pengalaman Anda</DialogTitle>
          <DialogDescription>
            Ulasan Anda sangat berarti untuk membantu kami berkembang.
          </DialogDescription>
        </DialogHeader>
        <TestimonialForm
          subscriptionId={subscriptionId}
          onSuccess={() => setOpen(false)} // Menutup dialog setelah berhasil
        />
      </DialogContent>
    </Dialog>
  );
}