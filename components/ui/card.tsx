import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[14px] border bg-white/4 p-6",
        "border-white/[0.09]",
        className
      )}
    >
      {children}
    </div>
  );
}
