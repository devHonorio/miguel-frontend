"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginForm } from "./useLoginForm";

import User from "@/entities/User";
import { useQuery } from "./useQuery";

export default function Login() {
  const {
    register,
    handleSubmit,
    errors: { password, phone },
    setValue,
  } = useLoginForm();

  const { mutate, isPending } = useQuery();

  return (
    <form
      className="flex w-full flex-col gap-5"
      onSubmit={handleSubmit((data) => {
        mutate(data);
      })}
    >
      <Input
        {...register("phone")}
        label="Telefone/Whatsapp"
        placeholder="(46) 9 9999-9999"
        error={phone?.message}
        onChange={(e) => setValue("phone", User.phoneMask(e.target.value))}
      />
      <Input
        {...register("password")}
        label="Senha"
        placeholder="******"
        type="password"
        error={password?.message}
      />
      <Button type="submit" isLoading={isPending}>
        Entrar
      </Button>
    </form>
  );
}
