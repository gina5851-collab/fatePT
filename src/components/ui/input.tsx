import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

// Ollama: text-input pill, soft surface fill, hairline border on focus.
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-full border border-hairline bg-canvas px-4 text-sm text-ink placeholder:text-mute focus-visible:outline-none focus-visible:border-ink focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
