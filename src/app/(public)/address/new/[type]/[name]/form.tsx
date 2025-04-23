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
}

const schema = z.object({
  number: z.coerce.number().min(0, "No mínimo 0."),
});

type typeSchema = z.infer<typeof schema>;

export const Form = ({ type, name }: FormProps) => {
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
      onSubmit={handleSubmit(({ number }) => {
        push(`/address/new/${type}/${name}/${number}`);
      })}
    >
      <div className="flex-2/3 py-2 capitalize">
        {type} {name} -
      </div>
      <Input
        placeholder="Numero da casa ou do prédio"
        {...register("number")}
        error={errors.number?.message}
        type="number"
        typeof="numeric"
      />
      <Button>Continuar</Button>
    </form>
  );
};
