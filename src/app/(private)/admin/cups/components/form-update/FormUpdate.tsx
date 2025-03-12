import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUpdate } from "../../hooks/query/useUpdate";
import { useEffect } from "react";
import { useFormUpdate } from "../../hooks/form";

interface FormUpdateProps {
  id: string;
}

export const FormUpdate = ({ id }: FormUpdateProps) => {
  const { isLoading, data, mutate, isPending } = useUpdate(id);

  const { errorSize, handleSubmit, register, reset } = useFormUpdate();

  useEffect(() => {
    reset(data);
  }, [data, reset]);

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
      className="space-y-2"
    >
      <Input {...register("id")} readOnly hidden />

      <Input
        {...register("size")}
        label="Tamanho/ml"
        type="number"
        min={0}
        error={errorSize}
      />

      <Button type="submit" isLoading={isPending}>
        Salvar
      </Button>
    </form>
  );
};
