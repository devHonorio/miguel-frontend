import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreate } from "../../hooks/query";
import { useFormCreate } from "../../hooks/form";

export const FormCreate = () => {
  const { mutate, isPending } = useCreate();
  const { register, handleSubmit, errorSize } = useFormCreate();
  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
      className="space-y-2"
    >
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
