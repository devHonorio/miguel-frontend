import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createCupSchema } from "../../schema";
import { removeString, toBRL } from "@/app/utils";

export const useFormCreate = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors: { size, price, description, in_stock, priceTemplate },
    },
    setValue,
    getValues,
    setFocus,
  } = useForm({
    resolver: zodResolver(createCupSchema),
    defaultValues: {
      size: 0,
      description: "Escolha até 3 acompanhamentos com esse copo",
      in_stock: true,
      priceTemplate: "R$ 00,00",
    },
  });

  const setInStock = (value: boolean) => {
    setValue("in_stock", value);
  };

  const setPriceTemplate = (value: string) => {
    const price = removeString(value);

    if (!price) return "R$ 00,00";

    const priceInCents = +price / 100;

    const priceFormated = toBRL(priceInCents);

    setValue("priceTemplate", `${priceFormated}`);
  };

  const setPrice = (value: string) => {
    const price = removeString(value);

    const priceInReal = +price / 100;

    setValue("price", priceInReal);
  };

  if (priceTemplate?.message) console.log("erro: ", priceTemplate?.message);

  return {
    register,
    handleSubmit,
    errorSize: size?.message,
    errorPrice: price?.message,
    errorDescription: description?.message,
    errorInStock: in_stock?.message,
    setInStock,
    setPriceTemplate,
    getValues,
    setPrice,
    setFocus,
  };
};
