import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  className?: string;
}

export function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] tracking-[0.3px] text-sembli-text/30 bg-white/5 border border-white/[0.08] rounded px-1.5 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
}
