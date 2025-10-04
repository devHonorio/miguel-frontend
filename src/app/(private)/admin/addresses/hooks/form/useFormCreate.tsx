import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cleanFormatBRLAndParseCents } from "@/app/utils/cleanFormatBRLAndParseCents";
import { addressSchema } from "../../schema";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";

export const useFormCreate = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setFocus,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      priceTemplate: "R$ 4,00",
      shipping_price: 400,
    },
  });

  const setPrice = (value: string) => {
    const priceInCents = cleanFormatBRLAndParseCents(value);

    setValue("shipping_price", priceInCents);

    setValue("priceTemplate", toCentsInBRL(priceInCents));
  };

  return {
    register,
    handleSubmit,
    errors,
    getValues,
    setPrice,
    setFocus,
  };
};
