"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginForm } from "./useLoginForm";

import { useQuery } from "./useQuery";

export function Form({ phone }: { phone: string }) {
  const {
    register,
    handleSubmit,
    errors: { name },
  } = useLoginForm();

  const { mutate, isPending } = useQuery();

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit((data) => {
        mutate({ phone, name: data.name });
      })}
    >
      <Input
        {...register("name")}
        label="Nome completo"
        placeholder="José Honorio"
        error={name?.message}
      />

      <Button type="submit" isLoading={isPending}>
        Avançar
      </Button>
    </form>
  );
}
