"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
   <Sonner
    theme={theme as ToasterProps["theme"]}
    className="toaster group"
    toastOptions={{
      classNames: {
        toast:
          // tambahkan `text-foreground` langsung
          "group toast bg-background text-foreground border-border shadow-lg",
        description: "text-muted-foreground",
        actionButton: "bg-primary text-primary-foreground",
        cancelButton: "bg-muted text-muted-foreground",
      },
    }}
    style={
      {
        "--normal-bg": "hsl(var(--background))",
        "--normal-border": "hsl(var(--border))",
        "--normal-text": "hsl(var(--foreground))",

        "--success-bg": "hsl(var(--success, 142.1 76.2% 36.3%))",
        "--success-border": "hsl(var(--success, 142.1 76.2% 36.3%))",
        "--success-text": "hsl(var(--success-foreground, 0 0% 98%))",

        "--error-bg": "hsl(var(--destructive))",
        "--error-border": "hsl(var(--destructive))",
        "--error-text": "hsl(var(--destructive-foreground))",
      } as React.CSSProperties
    }
    {...props}
  />
  );
};

export { Toaster };