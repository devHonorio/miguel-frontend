"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SwitchWithDescription } from "@/components/switch-with-description";
import { useFormUpdate } from "../../hooks/form";
import { useUpdate } from "../../hooks/query";
import { useEffect, useState } from "react";
import { toBRL } from "@/app/utils";
import { Loader2 } from "lucide-react";
interface FormUpdateProps {
  id: string;
}
export const FormUpdate = ({ id }: FormUpdateProps) => {
  const {
    errorName,
    errorPrice,
    handleSubmit,
    register,
    setPrice,
    setPriceTemplate,
    reset,
    setInStock,
  } = useFormUpdate();

  const { isPending, mutate, data, isLoading } = useUpdate(id);
  const [stock, setStock] = useState(true);

  useEffect(() => {
    reset({ ...data, priceTemplate: toBRL(data?.price ?? 0) });
    setStock(!!data?.in_stock);
  }, [data, reset]);

  const handleStock = (value: boolean) => {
    setInStock(value);
    setStock(value);
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <form className="space-y-2" onSubmit={handleSubmit((data) => mutate(data))}>
      <Input {...register("id")} hidden readOnly />

      <Input
        {...register("name")}
        label="Nome"
        error={errorName}
        placeholder="Morango"
      />

      <Input
        {...register("priceTemplate")}
        label="Preço/R$"
        error={errorPrice}
        placeholder="R$ 00,00"
        onChange={(e) => {
          setPriceTemplate(e.target.value);
          setPrice(e.target.value);
        }}
      />

      <SwitchWithDescription
        title="Em estoque"
        description="Se não estiver ativo não ira aparecer na lista de adicionais"
        onCheckedChange={handleStock}
        checked={stock}
      />

      <Button type="submit" isLoading={isPending}>
        Salvar
      </Button>
    </form>
  );
};
