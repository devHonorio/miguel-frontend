import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createOrderSchema, CreateOrderType } from "../../schema";

export const useFormCreate = (order: CreateOrderType) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createOrderSchema),
    values: order,
  });

  return {
    register,
    handleSubmit,
    errors,
    control,
  };
};
