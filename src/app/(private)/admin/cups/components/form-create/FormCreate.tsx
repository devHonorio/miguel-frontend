import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreate } from "../../hooks/query";
import { useFormCreate } from "../../hooks/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SwitchWithDescription } from "@/components/switch-with-description";

export const FormCreate = () => {
  const { mutate, isPending } = useCreate();
  const {
    register,
    handleSubmit,
    errorSize,
    errorPrice,
    errorDescription,
    errorInStock,
    setInStock,
    setPriceTemplate,
    setPrice,
  } = useFormCreate();

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

      <Input
        {...register("priceTemplate")}
        label="Preço/R$"
        error={errorPrice}
        onChange={(e) => {
          setPriceTemplate(e.target.value);
          setPrice(e.target.value);
        }}
        onClick={(e) => e.currentTarget.select()}
        placeholder="R$ 00,00"
      />

      <Textarea
        placeholder="Descreva as regras desse copo"
        {...register("description")}
        error={errorDescription}
      />

      <SwitchWithDescription error={errorPrice} />

      <Button type="submit" isLoading={isPending}>
        Salvar
      </Button>
    </form>
  );
};
