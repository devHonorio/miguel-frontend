"use client";
import { useOrderStore } from "@/app/store/order";
import { toBRL } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { useParams } from "next/navigation";

export default function Confirmation() {
  const { id } = useParams();

  const { cups } = useOrderStore();

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

        {!isError && !isLoading && <Button variant="secondary">Enviar</Button>}
        {isError && (
          <Button onClick={() => refetch()}>
            Error ao buscar dados, tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}
