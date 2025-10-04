import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cleanFormatBRLAndParseCents } from "@/app/utils/cleanFormatBRLAndParseCents";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import { addressSchema } from "../../schema";

export const useFormUpdate = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const setPrice = (value: string) => {
    const priceInReal = cleanFormatBRLAndParseCents(value);

    setValue("shipping_price", priceInReal);

    setValue("priceTemplate", toCentsInBRL(priceInReal));
  };

  return {
    register,
    handleSubmit,
    reset,
    errors,

    setPrice,
  };
};
