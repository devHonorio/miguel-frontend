import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createCupSchema } from "../../schema";
import { cleanAndFormatBRL } from "@/app/utils";
import { cleanFormatBRLAndParseCents } from "@/app/utils/cleanFormatBRLAndParseCents";

export const useFormCreate = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors: { size, price, description, in_stock, quantity_additional },
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
    const priceFormatted = cleanAndFormatBRL(value);

    setValue("priceTemplate", priceFormatted);
  };

  const setPrice = (value: string) => {
    const priceInCents = cleanFormatBRLAndParseCents(value);

    setValue("price", priceInCents);
  };

  return {
    register,
    handleSubmit,
    errorSize: size?.message,
    errorPrice: price?.message,
    errorDescription: description?.message,
    errorInStock: in_stock?.message,
    errorAdditional: quantity_additional?.message,
    setInStock,
    setPriceTemplate,
    getValues,
    setPrice,
    setFocus,
  };
};
