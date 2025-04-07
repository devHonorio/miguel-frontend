import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateSchema } from "../../schema";
import { cleanAndFormatBRL, cleanFormatBRLAndParseReal } from "@/app/utils";

export const useFormUpdate = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: {
      errors: { size, description, in_stock, price, quantity_additional },
    },
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

  const setInStock = (value: boolean) => {
    setValue("in_stock", value);
  };

  const setPriceTemplate = (value: string) => {
    const priceFormatted = cleanAndFormatBRL(value);

    setValue("priceTemplate", priceFormatted);
  };

  const setPrice = (value: string) => {
    const priceInReal = cleanFormatBRLAndParseReal(value);

    setValue("price", priceInReal);
  };

  return {
    register,
    handleSubmit,
    reset,
    errorSize: size?.message,
    errorPrice: price?.message,
    errorDescription: description?.message,
    errorInStock: in_stock?.message,
    errorQuantityAdditional: quantity_additional?.message,
    setInStock,
    setPriceTemplate,
    setPrice,
    inStockValue: () => getValues("in_stock"),
  };
};
