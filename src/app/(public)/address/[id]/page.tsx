"use client";
import { CupStore, useOrderStore } from "@/app/store/order";
import { toBRL } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Order {
  address_id?: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  cup_id: string;
  additional_ids: string[];
}

export default function Confirmation() {
  const { id } = useParams();

  const { cups, clean } = useOrderStore();

  const { api } = useApi();

  const { isLoading, isError, refetch, data } = useQuery<{
    address_complete: string;
    shipping_price: number;
  }>({
    queryKey: ["address", id],
    queryFn: async () => {
      const response = await api.get(`/address/${id}`);

      return response.data;
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
      };

      const response = await api.post("/order", order);

      return response.data;
    },

    onError: (err: AxiosError) => {
      toast.error("Error ao enviar pedido!");

      console.error(err);
    },
    onSuccess() {
      toast.success("Pedido enviado!");
      clean();
      push("/catalogo");
    },
  });

  return (
    <div className="flex w-full max-w-xl flex-col gap-3 px-10 pb-72">
      <Link href="/address">
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>
      <div className="text-xl font-bold">Resumo do pedido: </div>

      <div className="space-y-2">
        {cups.map(({ id, price, size, additional }) => (
          <div key={id} className="rounded-md bg-black/5 px-4 py-3">
            <div>Copo {size}ml</div>
            <div>{additional.map(({ name }) => name).join(", ")}</div>
            <div>{toBRL(price)}</div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 flex w-full flex-col bg-gray-100 p-10">
        {isLoading && <Loader2 className="animate-spin" />}
        {data?.address_complete && (
          <div className="space-y-2 font-bold text-black/70">
            <div className="uppercase">{data.address_complete}</div>

            <div className="flex gap-2">
              <div>Entrega:</div>
              <div>{toBRL(data.shipping_price)}</div>
            </div>

            <div className="flex gap-2">
              <div>Total: </div>
              <div>{toBRL(valueCups + data.shipping_price)}</div>
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
