import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap px-5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-85",
        outline: "border border-border bg-transparent text-foreground hover:bg-accent",
        ghost: "text-foreground hover:bg-accent",
      },
      size: {
        default: "h-11",
        lg: "h-14 px-7 text-base",
        icon: "size-11 px-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
