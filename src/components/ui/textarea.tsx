import * as React from "react";

import { cn } from "@/lib/utils";
import { InputProps } from "./input";
import { Label } from "./label";

function Textarea({
  className,
  label,
  error,
  ...props
}: React.ComponentProps<"textarea"> & InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <Label>{label}</Label>}
      <textarea
        data-slot="textarea"
        data-error={!!error}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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

export { Textarea };
