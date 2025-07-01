import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeSchema } from "./schema";

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(codeSchema) });

  return {
    register,
    handleSubmit,
    errors,
    setValue,
  };
};
