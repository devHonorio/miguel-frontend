"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormProps {
  type: string;
  name: string;
  number: number;
  district: string;
}

const schema = z.object({
  city: z.string().min(0, "No mínimo 0."),
});

type typeSchema = z.infer<typeof schema>;

export const Form = ({ name, number, type, district }: FormProps) => {
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
      onSubmit={handleSubmit(({ city }) => {
        push(`/address/new/${type}/${name}/${number}/${district}/${city}`);
      })}
    >
      <Input
        label="Cidade"
        placeholder="ex: Ampére"
        {...register("city")}
        error={errors.city?.message}
      />

      <Button>Continuar</Button>
    </form>
  );
};
