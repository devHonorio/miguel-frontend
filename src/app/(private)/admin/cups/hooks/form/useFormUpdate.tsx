import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateSchema } from "../../schema";

export const useFormUpdate = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: {
      errors: { size },
    },
  } = useForm({
    resolver: zodResolver(updateSchema),
  });

  return { register, handleSubmit, errorSize: size?.message, reset };
};
