import * as React from "react"
import { cn } from "@/lib/utils"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

/**
 * Clinical Input Component
 * - 48px height for accessibility.
 * - High contrast focus rings for visual clarity.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-[48px] w-full rounded-clinical border-2 border-medical-green-100 bg-white px-4 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-medical-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
