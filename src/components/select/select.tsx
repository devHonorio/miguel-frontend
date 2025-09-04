import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
interface CustomSelectProps {
  data: { label: string; value: string }[];
  label?: string;
  size?: "default" | "sm";
  onSelect?: (value: string, label: string) => void;
  errorMessage?: string;
}

export const CustomSelect = ({
  data,
  label: labelProp = "Selecione",
  size,
  onSelect = () => {},
  errorMessage,
}: CustomSelectProps) => {
  return (
    <Select
      onValueChange={(value) => {
        const currentItem = data.find((item) => item.value === value)!;

        onSelect(currentItem.value, currentItem.label);
      }}
    >
      <SelectTrigger size={size}>
        <SelectValue placeholder={errorMessage || labelProp} />
      </SelectTrigger>

      <SelectContent>
        {data.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
