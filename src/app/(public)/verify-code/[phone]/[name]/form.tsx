"use client";
import { Button } from "@/components/ui/button";
import { useLoginForm } from "./useLoginForm";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useQuery } from "./useQuery";

export function Form({ phone, name }: { phone: string; name: string }) {
  const {
    setValue,
    handleSubmit,
    errors: { code },
  } = useLoginForm();

  const { mutate, isPending } = useQuery();

  return (
    <form
      className="flex w-full flex-col items-center gap-5"
      onSubmit={handleSubmit((data) => {
        mutate({ phone, code: data.code });
      })}
    >
      <p>
        Oie, <span className="capitalize">{decodeURI(name)}</span> digite o
        código que recebeu no whatsApp
      </p>
      <InputOTP
        maxLength={4}
        typeof="numeric"
        pattern={REGEXP_ONLY_DIGITS}
        onChange={(value) => {
          setValue("code", value);
        }}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
      {code?.message && <p className="text-red-600">{code?.message}</p>}

      <Button type="submit" isLoading={isPending} className="w-full">
        Avançar
      </Button>
    </form>
  );
}
