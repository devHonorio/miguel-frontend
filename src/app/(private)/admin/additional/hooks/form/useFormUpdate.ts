import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { additionalSchema } from "../schema";
import { cleanAndFormatBRL, cleanFormatBRLAndParseReal } from "@/app/utils";

export const useFormUpdate = () => {
  const {
    formState: {
      errors: { name, price },
    },
    setValue,
    register,
    handleSubmit,
    reset,
  } = useForm({ resolver: zodResolver(additionalSchema) });

  const setPriceTemplate = (value: string) => {
    const priceFormatted = cleanAndFormatBRL(value);

    setValue("priceTemplate", priceFormatted);
  };

  const setPrice = (value: string) => {
    const priceInReal = cleanFormatBRLAndParseReal(value);

    setValue("price", priceInReal);
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
    reset,
  };
};
