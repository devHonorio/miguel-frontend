import { Switch } from "../ui/switch";

interface SwitchWithDescriptionProps {
  error?: string;
}

export const SwitchWithDescription = ({
  error,
  ...props
}: SwitchWithDescriptionProps) => {
  return (
    <div
      data-error={!!error}
      className="flex rounded-md border p-3 shadow data-[error=true]:border-red-600"
    >
      <div className="flex-1">
        <div className="font-bold">Em estoque</div>
        <div className="text-black/60">
          Se não estiver ativo o copo não ira aparecer nas pagina inicial
        </div>
      </div>
      <Switch {...props} defaultChecked />

      {error && (
        <p data-error={!!error} className="data-[error=true]:text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};
