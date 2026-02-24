import { ChevronLeft } from "lucide-react";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BackButtonProps {
    href?: string;
    label?: string;
    className?: string;
}

export function BackButton({
    href = "/dashboard",
    label,
    className
}: BackButtonProps) {
    const t = useTranslations("Common");

    return (
        <Link
            href={href}
            className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-medical-green-700 font-bold hover:bg-medical-green-50 transition-colors group",
                className
            )}
        >
            <div className="p-1 rounded-full bg-medical-green-100 group-hover:bg-medical-green-200 transition-colors">
                <ChevronLeft className="w-5 h-5" />
            </div>
            <span>{label || t("back")}</span>
        </Link>
    );
}
