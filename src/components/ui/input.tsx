import * as React from "react";

import { cn } from "@/lib/utils";
import { Label } from "./label";

interface InputProps {
  label?: string;
  error?: string;
}

function Input({
  className,
  type,
  label,
  error,
  ...props
}: React.ComponentProps<"input"> & InputProps) {
  const id = React.useId();
  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        id={id}
        type={type}
        data-slot="input"
        data-error={!!error}
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "data-[error=true]:border-red-600",
          className,
        )}
        {...props}
      />

      {error && (
        <p data-error={!!error} className="data-[error=true]:text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export { Input };
