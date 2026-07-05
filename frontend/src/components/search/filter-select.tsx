"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ALL_FILTER_VALUE } from "@/lib/filters";
import { cn } from "@/lib/utils";

interface FilterSelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly FilterSelectOption[];
  placeholder: string;
  className?: string;
}

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className,
}: FilterSelectProps) {
  const isDefault = value === ALL_FILTER_VALUE;
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <Select value={value} onValueChange={(v) => onValueChange(v ?? options[0].value)}>
      <SelectTrigger className={cn("w-full", className)}>
        <span
          className={cn(
            "flex flex-1 text-left line-clamp-1",
            isDefault && "text-muted-foreground"
          )}
        >
          {isDefault ? placeholder : (selectedLabel ?? placeholder)}
        </span>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
