import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
}

/**
 * Clinical Select Component
 * - Matches Input/Button design system: 48px height, clinical radii, focus rings.
 * - Custom chevron icon via Lucide for visual consistency.
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div className="relative">
                <select
                    ref={ref}
                    className={cn(
                        "flex h-[48px] w-full rounded-clinical border-2 border-medical-green-100 bg-white px-4 pr-10 py-2 text-base font-bold ring-offset-background appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
                    aria-hidden="true"
                />
            </div>
        )
    }
)
Select.displayName = "Select"

export { Select }
