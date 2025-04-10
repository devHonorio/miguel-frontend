import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUpdate } from "../../hooks/query/useUpdate";
import { useEffect, useState } from "react";
import { useFormUpdate } from "../../hooks/form";
import { Textarea } from "@/components/ui/textarea";
import { SwitchWithDescription } from "@/components/switch-with-description";
import { toBRL } from "@/app/utils";

interface FormUpdateProps {
  id: string;
}

export const FormUpdate = ({ id }: FormUpdateProps) => {
  const { isLoading, data, mutate, isPending } = useUpdate(id);

  const {
    errorSize,
    handleSubmit,
    register,
    reset,
    errorDescription,
    errorInStock,
    errorPrice,
    errorQuantityAdditional,
    setInStock,
    setPrice,
    setPriceTemplate,
  } = useFormUpdate();

  const [stock, setStock] = useState(true);

  useEffect(() => {
    setStock(!!data?.in_stock);
    reset({ ...data, priceTemplate: toBRL(data?.price ?? 0) });
    console.log(data);
  }, [data, reset]);

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data);
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

      <Input
        {...register("quantity_additional")}
        label="Quantidade de adicionais"
        type="number"
        min={0}
        error={errorQuantityAdditional}
      />

      <Textarea
        label="Descrição"
        placeholder="Descreva as regras desse copo"
        {...register("description")}
        error={errorDescription}
      />

      <SwitchWithDescription
        error={errorInStock}
        onCheckedChange={(value) => {
          setInStock(value);
          setStock(value);
        }}
        checked={stock}
        title="Em estoque"
        description="Se não estiver ativo o copo não ira aparecer nas pagina inicial"
      />

      <Button type="submit" isLoading={isPending}>
        Salvar
      </Button>
    </form>
  );
};
