import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.8px] text-sembli-text/35",
        className
      )}
    >
      {children}
    </p>
  );
}
