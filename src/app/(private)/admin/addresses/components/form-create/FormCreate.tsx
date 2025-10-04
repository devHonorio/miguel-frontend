import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreate } from "../../hooks/query";
import { useFormCreate } from "../../hooks/form";
import { Textarea } from "@/components/ui/textarea";

export const FormCreate = () => {
  const { mutate, isPending } = useCreate();
  const { register, handleSubmit, errors, setPrice } = useFormCreate();

  return (
    <form
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
      className="space-y-2"
    >
      <Input
        className="uppercase"
        {...register("street")}
        label="Rua"
        error={errors.street?.message}
      />

      <Input
        {...register("number")}
        label="Número"
        type="number"
        typeof="numeric"
        error={errors.number?.message}
      />

      <Input
        className="uppercase"
        {...register("district")}
        label="Bairro"
        error={errors.district?.message}
      />

      <Input
        className="uppercase"
        {...register("city")}
        label="Cidade"
        error={errors.city?.message}
      />

      <Textarea
        className="uppercase"
        {...register("complement")}
        label="Complemento"
        error={errors.complement?.message}
      />

      <Input
        {...register("priceTemplate")}
        label="Preço/R$"
        error={errors.shipping_price?.message}
        onChange={(e) => {
          setPrice(e.target.value);
        }}
        onClick={(e) => e.currentTarget.select()}
        placeholder="R$ 00,00"
      />

      <Button type="submit" isLoading={isPending}>
        Salvar
      </Button>
    </form>
  );
};
