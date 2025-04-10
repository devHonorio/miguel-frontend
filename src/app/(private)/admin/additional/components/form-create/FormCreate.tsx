"use client";
import { Input } from "@/components/ui/input";
import { useFormCreate } from "../../hooks/form";
import { Button } from "@/components/ui/button";
import { useCreate } from "../../hooks/query";
import { SwitchWithDescription } from "@/components/switch-with-description";

export const FormCreate = () => {
  const {
    errorName,
    errorPrice,
    handleSubmit,
    register,
    setPrice,
    setPriceTemplate,
    setInStock,
  } = useFormCreate();

  const { isPending, mutate } = useCreate();

  return (
    <form className="space-y-2" onSubmit={handleSubmit((data) => mutate(data))}>
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
        onCheckedChange={setInStock}
        defaultChecked
      />

      <Button type="submit" isLoading={isPending}>
        Salvar
      </Button>
    </form>
  );
};
