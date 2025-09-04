"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ComboboxProps {
  data: { value: string; label: string; complement?: string }[];
  label?: string;
  size?: "default" | "sm" | "lg" | "icon" | null;
  overlay?: boolean;
  onChange?: (value: string) => void;
  shouldFilter?: boolean;
  isLoading?: boolean;
  value?: string;
  onSelect?: (value: string, label: string) => void;
  errorMessage?: string;
}

export function Combobox({
  data,
  label: labelProp = "Selecionar",
  size,
  overlay = true,
  onChange,
  shouldFilter = true,
  isLoading = false,
  value: valueProp = "",
  errorMessage,
  onSelect = () => {},
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(valueProp);
  const [label, setLabel] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!!errorMessage && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size={size}
            data-error={!!errorMessage}
            className="border-red-500 text-red-500"
            onClick={() => console.log("teste")}
          >
            {errorMessage}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </DialogTrigger>
      )}

      {!errorMessage && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className="h-fit min-h-9 whitespace-break-spaces"
          >
            {label && label}
            {!label && labelProp}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </DialogTrigger>
      )}

      <></>

      <DialogContent overlay={overlay}>
        <DialogTitle>Procurar</DialogTitle>
        <Command shouldFilter={shouldFilter}>
          <CommandInput onValueChange={onChange} />
          <CommandList>
            {isLoading && (
              <CommandGroup>
                <CommandItem>
                  <Loader2 className="mx-auto animate-spin" />
                </CommandItem>
              </CommandGroup>
            )}
            {!isLoading && (
              <>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {data.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.label}
                      onSelect={() => {
                        setOpen(false);

                        if (item.value === value) {
                          setValue("");
                          setLabel("");
                          return;
                        }
                        setValue(item.value);
                        setLabel(item.label);
                        onSelect(item.value, item.label);
                      }}
                    >
                      <div>
                        <div>{item.label}</div>
                        <div className="opacity-70">{item.complement}</div>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto",
                          value === item.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
