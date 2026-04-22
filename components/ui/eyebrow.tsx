import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.8px]",
        className
      )}
      style={{ color: 'rgba(26,24,20,0.4)' }}
    >
      {children}
    </p>
  );
}
