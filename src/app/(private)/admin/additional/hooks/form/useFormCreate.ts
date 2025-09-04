import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { additionalSchema } from "../schema";
import { cleanAndFormatBRL } from "@/app/utils";
import { cleanFormatBRLAndParseCents } from "@/app/utils/cleanFormatBRLAndParseCents";

export const useFormCreate = () => {
  const {
    formState: {
      errors: { name, price },
    },
    setValue,
    register,
    handleSubmit,
  } = useForm({ resolver: zodResolver(additionalSchema) });

  const setPriceTemplate = (value: string) => {
    const priceFormatted = cleanAndFormatBRL(value);
    console.log(priceFormatted);

    setValue("priceTemplate", priceFormatted);
  };

  const setPrice = (value: string) => {
    const priceInCents = cleanFormatBRLAndParseCents(value);

    setValue("price", priceInCents);
  };

  const setInStock = (checked: boolean) => {
    setValue("in_stock", checked);
  };

  return {
    errorName: name?.message,
    errorPrice: price?.message,
    setPrice,
    setPriceTemplate,
    setInStock,
    handleSubmit,
    register,
  };
};
