"use client";
import { getAddress } from "@/app/services/address/getAddress";
import { postOrder } from "@/app/services/order/postOrder";
import { CupStore, useOrderStore } from "@/app/store/order";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHOD } from "@/consts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { useParams, useRouter } from "next/navigation";
import { parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";
import { toast } from "sonner";

interface Order {
  address_id?: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  cup_id: string;
  additional_ids: string[];
}

const paymentMethod = {
  pix: "pix",
  credit: "cartão de crédito",
  debit: "cartão de débito",
  cash: "dinheiro",
};

export default function Confirmation() {
  const { id } = useParams<{ id: string }>();

  const [meta] = useQueryStates({
    hour: parseAsString.withDefault("00:00"),
    change: parseAsString,
    paymentMethod: parseAsStringEnum([...PAYMENT_METHOD]).withDefault("pix"),
  });

  const { cups, clean } = useOrderStore();

  const { isLoading, isError, refetch, data } = useQuery<{
    address_complete: string;
    shipping_price: number;
  }>({
    queryKey: ["address", id],
    queryFn: async () => {
      if (id === "pick-up-local")
        return { address_complete: "Retirada no local", shipping_price: 0 };

      return await getAddress(id);
    },
  });

  const valueCups = cups.reduce((acc, cup) => acc + cup.price, 0);

  const { push } = useRouter();

  const { isPending, mutate } = useMutation({
    mutationFn: async (cups: CupStore[]) => {
      const order: Order = {
        order_items: cups.map(({ cup_id, additional }) => ({
          additional_ids: additional.map((add) => add.id!),
          cup_id,
        })),
        address_id: id === "pick-up-local" ? undefined : id,
      };

      return await postOrder({
        ...order,
        hour: meta.hour,
        paymentMethod: meta.paymentMethod,
        change: meta.change ? meta.change : undefined,
      });
    },

    onError: (err: AxiosError) => {
      toast.error("Error ao enviar pedido!");

      console.log(err);
    },
    onSuccess() {
      toast.success("Pedido enviado!");
      clean();
      push("/catalogo");
    },
  });

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 px-10 pb-72">
      <Link
        href={`/address?hour=${meta.hour}&paymentMethod=${meta.paymentMethod}&change=${meta.change}`}
      >
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>
      <div className="text-xl font-bold">Resumo do pedido: </div>

      <div>
        Às {meta.hour}, pagamento no {paymentMethod[meta.paymentMethod]}
        {meta.change !== "undefined" && ` ,troco para ${meta.change}`}
      </div>

      <div className="space-y-2">
        {cups.map(({ id, price, size, additional }) => (
          <div key={id} className="rounded-md bg-black/5 px-4 py-3">
            <div>Copo {size}ml</div>
            <div>{additional.map(({ name }) => name).join(", ")}</div>
            <div>{toCentsInBRL(price)}</div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col bg-gray-100 p-10">
        {isLoading && <Loader2 className="animate-spin" />}
        {data?.address_complete && (
          <div className="space-y-2 font-bold text-black/70">
            <div className="uppercase">{data.address_complete}</div>

            {data.shipping_price > 0 && (
              <div className="flex gap-2">
                <div>Entrega:</div>
                <div>{toCentsInBRL(data.shipping_price)}</div>
              </div>
            )}

            <div className="flex gap-2">
              <div>Total: </div>
              <div>{toCentsInBRL(valueCups + data.shipping_price)}</div>
            </div>
            <div className="text-orange-500">
              Após enviar pedido aguarde a confirmação pelo WhatsApp
            </div>
          </div>
        )}

        {!isError && !isLoading && (
          <Button
            variant="secondary"
            isLoading={isPending}
            onClick={() => {
              mutate(cups);
            }}
          >
            Enviar
          </Button>
        )}
        {isError && (
          <Button onClick={() => refetch()}>
            Error ao buscar dados, tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}
