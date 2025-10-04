"use client";

import { postAddress } from "@/app/services/address/postAddress";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface FormProps {
  type: string;
  name: string;
  number: number;
  district: string;
  city: string;
}

const schema = z.object({
  complement: z.string().min(0, "No mínimo 0."),
});

type typeSchema = z.infer<typeof schema>;

export interface CreateAddress {
  street: string;
  number: number;
  district: string;
  city: string;
  complement: string;
}

export const Form = ({ name, number, type, city, district }: FormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeSchema>({
    resolver: zodResolver(schema),
  });

  const { push } = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: postAddress,
    onSuccess: () => {
      push("/address");
      toast.success("Endereço criado");
    },
    onError: (error: AxiosError) => {
      toast.error("Erro ao salvar!" + JSON.stringify(error.response?.data));
    },
  });
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={handleSubmit(({ complement }) => {
        mutate({
          street: `${type} ${name}`,
          number,
          district,
          city,
          complement,
        });
      })}
    >
      <Textarea
        rows={10}
        label="Me explique como chegar a sua casa."
        placeholder="ex: Perto da prefeitura, tem um pé de sete copas na frente, não tem numero mas a caso ao lado é a numero 12, casa dos fundos"
        {...register("complement")}
        error={errors.complement?.message}
      />

      <Button isLoading={isPending} disabled={isPending}>
        Salvar endereço
      </Button>
    </form>
  );
};
