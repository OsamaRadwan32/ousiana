import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Note: `bg-accent` resolves to var(--accent), which a .theme-* wrapper can
// swap. So a button inside <section class="theme-coral"> turns coral without
// taking a prop. Default accent is ink (charcoal).
//
// Spacing uses logical properties only (ps-/pe-, not pl-/pr-) so RTL mirrors
// for free.

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Charcoal, not a colour. Each Bloom owns an accent already; a
        // coloured primary button would be a fourth accent belonging to nothing.
        primary: "bg-ink text-sand-50 hover:bg-ink-soft",
        accent: "bg-accent text-sand-50 hover:opacity-90",
        outline: "border border-blush-200 bg-sand-100 text-ink hover:bg-blush-100",
        ghost: "text-ink hover:bg-blush-100",
        whatsapp: "bg-[#25D366] text-white hover:brightness-95",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
