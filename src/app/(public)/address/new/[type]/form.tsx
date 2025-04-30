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
        const path =
          type === "linha"
            ? `/address/new/linha/${name}/0/zona rural/`
            : `/address/new/${type}/${name}`;

        push(path);
      })}
    >
      <div className="flex h-9 w-full items-center rounded-md border bg-transparent px-3 py-1 text-base shadow-xs md:text-sm">
        <div className="capitalize">{type}</div>
        <Input
          className="w-full border-none shadow-none focus-visible:ring-0"
          placeholder={`nome da ${type}`}
          {...register("name")}
        />
      </div>

      {errors.name?.message && (
        <p className="text-red-600">{errors.name?.message}</p>
      )}

      <Button>Continuar</Button>
    </form>
  );
};
