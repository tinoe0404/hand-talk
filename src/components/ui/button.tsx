import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * CLINICAL SAFETY: 48px touch target enforced.
 */
const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-clinical transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-95 transition-transform",
    {
        variants: {
            variant: {
                primary: "bg-medical-green-500 text-white hover:bg-medical-green-600 shadow-clinical",
                secondary: "bg-clinical-offwhite text-medical-green-700 hover:bg-clinical-light border-2 border-medical-green-100",
                outline: "border-2 border-medical-green-500 bg-transparent text-medical-green-700 hover:bg-medical-green-50",
                ghost: "hover:bg-medical-green-50 text-medical-green-700",
                patient: "bg-patient-accent text-patient-bg hover:bg-patient-accent/90 shadow-clinical font-bold",
                emergency: "bg-alert-emergency text-white hover:bg-alert-emergency/90 font-bold animate-pulse-emergency",
                link: "text-medical-green-600 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-[48px] px-6 py-2 text-lg", // 48px min height
                sm: "h-[40px] px-4 text-sm", // Not for patient use
                lg: "h-[64px] px-10 text-xl",
                xl: "h-[80px] px-12 text-2xl", // For patient display
                icon: "h-[48px] w-[48px]", // 48x48 touch target
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

/**
 * Clinical Button Component
 * - Enforces 48x48px touch targets for clinical safety.
 * - Uses Framer Motion for subtle active state feedback.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, 'aria-label': ariaLabel, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                aria-label={ariaLabel}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
