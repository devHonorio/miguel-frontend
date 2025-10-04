"use client";
import { useOrderStore } from "@/app/store/order";
import { cleanFormatBRLAndParseCents } from "@/app/utils/cleanFormatBRLAndParseCents";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAYMENT_METHOD } from "@/consts";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    hour: z
      .string()
      .refine(
        (time) => {
          const timeRegex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)(?::(?:[0-5]\d))?$/;
          return timeRegex.test(time);
        },
        {
          message: "Hora inválida",
        },
      )
      .refine(
        (time) => {
          const [hour, minute] = time.split(":").map(Number);
          const totalMinutes = hour * 60 + minute;
          const START_HOUR = 840;
          const END_HOUR = 1080;
          return totalMinutes >= START_HOUR && totalMinutes <= END_HOUR;
        },
        {
          message: "Pedidos apenas entre as 14:00 e 18:00",
        },
      )
      .refine(
        (time) => {
          const [hour, minute] = time.split(":").map(Number);
          const totalMinutes = hour * 60 + minute;

          const now = new Date();

          const nowMinutes = now.getHours() * 60 + now.getMinutes();

          return totalMinutes >= nowMinutes;
        },
        {
          message: "Hora deve ser maior ou igual que a hora atual.",
        },
      ),
    paymentMethod: z.enum(PAYMENT_METHOD, {
      errorMap: () => ({ message: "Forma de pagamento é obrigatória!" }),
    }),
    change: z.string().optional(),
  })
  .refine(
    ({ paymentMethod, change }) => {
      if (paymentMethod === "cash") return !!change;

      return true;
    },
    { path: ["change"], message: "Se não precisar de troco coloque R$ 00,00" },
  );

export type FormType = z.infer<typeof schema>;

export default function HourAndChange() {
  const { cups } = useOrderStore();

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const isCash = watch("paymentMethod") === "cash";

  const { push } = useRouter();

  return (
    <form
      onSubmit={handleSubmit(({ hour, paymentMethod, change }) => {
        push(
          `/address?hour=${hour}&paymentMethod=${paymentMethod}&change=${change}`,
        );
      })}
      className="mx-auto flex w-xs flex-col items-start gap-3 pt-5"
    >
      <Link href="/orderDetails">
        <Button variant="secondary" type="button">
          <ArrowLeft /> Voltar
        </Button>
      </Link>
      <Input
        type="time"
        label="Hora"
        {...register("hour")}
        error={errors.hour?.message}
      />

      <Select
        label="Forma de pagamento"
        data={[
          { label: "Pix", value: "pix" },
          { label: "Cartão de crédito", value: "credit" },
          { label: "Cartão de débito", value: "debit" },
          { label: "Dinheiro", value: "cash" },
        ]}
        onSelect={(paymentMethod) => {
          setValue("paymentMethod", paymentMethod as FormType["paymentMethod"]);
          clearErrors("paymentMethod");
        }}
        errorMessage={errors.paymentMethod?.message}
      />

      {isCash && (
        <Input
          label="Troco para quanto ?"
          placeholder="Troco"
          {...register("change")}
          onChange={(e) => {
            const value = cleanFormatBRLAndParseCents(e.target.value);

            setValue("change", toCentsInBRL(+value));
          }}
          error={errors.change?.message}
        />
      )}

      <div className="fixed right-0 bottom-0 left-0 flex flex-col items-end gap-5 bg-white p-10">
        <div className="space-x-2">
          <Link href="/orderDetails">
            <Button variant="outline" size="lg" type="button">
              Voltar
            </Button>
          </Link>

          {!!cups.length && (
            <Button variant="secondary" size="lg">
              Continuar
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
