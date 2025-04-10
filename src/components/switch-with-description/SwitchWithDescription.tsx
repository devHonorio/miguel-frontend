import { Switch } from "../ui/switch";
import { Root } from "@radix-ui/react-switch";

interface SwitchWithDescriptionProps extends React.ComponentProps<typeof Root> {
  error?: string;
  title: string;
  description?: string;
}

export const SwitchWithDescription = ({
  error,
  title,
  description,
  ...props
}: SwitchWithDescriptionProps) => {
  return (
    <div
      data-error={!!error}
      className="flex rounded-md border p-3 shadow data-[error=true]:border-red-600"
    >
      <div className="flex-1">
        <div className="font-bold">{title}</div>
        <div className="text-black/60">{description}</div>
      </div>
      <Switch {...props} />

      {error && (
        <p data-error={!!error} className="data-[error=true]:text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
