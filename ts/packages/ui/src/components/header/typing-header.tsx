import { cn } from "../../lib/utils";

export interface TypingHeaderProps {
  text: string;
  size?:
    | "text-xl"
    | "text-2xl"
    | "text-3xl"
    | "text-4xl"
    | "text-5xl"
    | "text-6xl";
  className?: string;
}

export function TypingHeader({
  text,
  size = "text-2xl",
  className,
}: TypingHeaderProps) {
  return (
    <h1
      className={cn(
        "relative w-[max-content] font-vt323",
        size,
        "before:absolute before:inset-0 before:animate-typewriter before:bg-background",
        "after:absolute after:inset-0 after:w-[0.125em] after:animate-caret after:bg-foreground",
        className,
      )}
    >
      {text}
    </h1>
  );
}
