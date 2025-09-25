"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface DatePickerProps {
  value?: Date;
  onSelect?: (date?: Date) => void;
  min?: boolean;
}

export const DatePicker = ({
  onSelect = () => {},
  value,
  min,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" id="date" className="font-normal">
          {date
            ? min
              ? date.toLocaleDateString().slice(0, 5)
              : date.toLocaleDateString()
            : "Select date"}
          <ChevronDown />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto overflow-hidden p-0">
        <DialogHeader className="hidden">
          <DialogTitle>Data</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
            onSelect(date);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
