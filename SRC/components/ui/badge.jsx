// src/components/ui/badge.js
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80 bg-blue-600 text-white",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-200 text-gray-800",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 bg-red-600 text-white",
        outline:
          "text-foreground border border-input hover:bg-accent hover:text-accent-foreground border-gray-300 text-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };