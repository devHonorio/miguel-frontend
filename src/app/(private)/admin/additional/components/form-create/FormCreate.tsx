"use client";
import { Input } from "@/components/ui/input";
import { useFormCreate } from "../../hooks/form";
import { Button } from "@/components/ui/button";
import { useCreate } from "../../hooks/query";

export const FormCreate = () => {
  const {
    errorName,
    errorPrice,
    handleSubmit,
    register,
    setPrice,
    setPriceTemplate,
  } = useFormCreate();

  const { isPending, mutate } = useCreate();

  return (
    <form
      className="space-y-2"
      onSubmit={handleSubmit(({ name, price }) => mutate({ name, price }))}
    >
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

      <Button type="submit" isLoading={isPending}>
        Salvar
      </Button>
    </form>
  );
};
