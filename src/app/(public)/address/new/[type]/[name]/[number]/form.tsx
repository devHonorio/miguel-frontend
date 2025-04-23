"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface FormProps {
  type: string;
  name: string;
  number: number;
}

const schema = z.object({
  complement: z.string().min(0, "No mínimo 0."),
});

type typeSchema = z.infer<typeof schema>;

export const Form = ({ name, number, type }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeSchema>({
    resolver: zodResolver(schema),
  });

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(({ complement }) => {
        toast.success(JSON.stringify({ name, number, type, complement }));
      })}
    >
      <Textarea
        rows={10}
        label="Me explique como chegar a sua casa."
        placeholder="ex: Perto da prefeitura, tem um pé de sete copas na frente, não tem numero mas a caso ao lado é a numero 12, casa dos fundos"
        {...register("complement")}
        error={errors.complement?.message}
      />

      <Button>Salvar endereço</Button>
    </form>
  );
};
