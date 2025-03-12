import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createCupSchema } from "../../schema";

export const useFormCreate = () => {
  const {
    register,
    handleSubmit,
    formState: {
      errors: { size },
    },
  } = useForm({
    resolver: zodResolver(createCupSchema),
    defaultValues: { size: 0 },
  });

  return { register, handleSubmit, errorSize: size?.message };
};
