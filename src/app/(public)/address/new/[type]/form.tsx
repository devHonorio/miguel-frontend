"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormProps {
  type: string;
}

const schema = z.object({
  name: z
    .string()
    .min(4, "No mínimo 3 letras.")
    .max(50, "No máximo 50 letras."),
});

type typeSchema = z.infer<typeof schema>;

export const Form = ({ type }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeSchema>({
    resolver: zodResolver(schema),
  });

  const { push } = useRouter();
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(({ name }) => {
        push(`/address/new/${type}/${name}`);
      })}
    >
      <div className="capitalize">{type}:</div>
      <Input
        placeholder={`Nome da ${type}`}
        {...register("name")}
        error={errors.name?.message}
      />

      <Button>Continuar</Button>
    </form>
  );
};
