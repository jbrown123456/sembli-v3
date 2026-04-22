import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

interface SectionHeaderProps {
  eyebrow: string;
  heading: React.ReactNode;
  className?: string;
}

export function SectionHeader({ eyebrow, heading, className }: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-16", className)}>
      <Eyebrow className="mb-3">{eyebrow}</Eyebrow>
      <h2 className="font-heading text-3xl sm:text-4xl font-normal tracking-tight text-sembli-text">
        {heading}
      </h2>
    </div>
  );
}
