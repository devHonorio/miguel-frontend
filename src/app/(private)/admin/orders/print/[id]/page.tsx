"use client";

import { useApi } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ResponseOrder } from "../../page";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import User from "@/entities/User";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Courier_Prime } from "next/font/google";

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Print() {
  const { id } = useParams<{ id: string }>();

  const { api } = useApi();
  const { isLoading, data } = useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`);

      return response.data as ResponseOrder;
    },
  });

  const { back } = useRouter();

  const [showButtons, setShowButtons] = useState(true);

  return (
    <div className="absolute top-0 right-0 left-0 flex min-h-svh flex-col items-center bg-white text-sm">
      {showButtons && (
        <div className="space-x-2 py-2">
          <Button variant="outline" onClick={() => back()}>
            <ArrowLeft />
            Voltar
          </Button>

          <Button
            onClick={() => {
              setShowButtons(false);
              setTimeout(() => {
                window.print();
                setShowButtons(true);
              });
            }}
          >
            <Printer />
            Imprimir
          </Button>
        </div>
      )}

      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && (
        <div
          className={`flex w-full max-w-xs flex-col gap-10 p-1 ${courierPrime.className}`}
        >
          <div>
            <div className="capitalize">{data?.client_label}</div>
            <div>{User.phoneMask(data!.phone.slice(2, 13))}</div>
          </div>
          <div>
            {data?.cups.map(({ label, additional, total_price }, i) => (
              <div key={i} className="flex items-baseline gap-1">
                <div className="font-bold">{label}</div>
                <div>
                  {additional.map((additional) => additional.label).join(", ")}
                </div>

                <Divider />
                <div className="font-bold">{toCentsInBRL(total_price)}</div>
              </div>
            ))}
          </div>

          {!!data?.discount && (
            <div className="flex items-baseline font-bold">
              <div>Desconto</div>
              <Divider />
              <div>{toCentsInBRL(data.discount)}</div>
            </div>
          )}

          {data?.address_id && (
            <div>
              <div className="flex items-baseline font-bold">
                <div>Entrega</div>
                <Divider />
                <div>{toCentsInBRL(data.shipping_price)}</div>
              </div>
              <div className="pt-5 uppercase">{data.address_label}</div>
            </div>
          )}

          {!data?.address_id && (
            <div className="font-bold">Retirada no local</div>
          )}
          <div>
            <Divider />
            <div className="flex justify-between font-black">
              <div>Total:</div>
              <div>{toCentsInBRL(data?.total_price || 0)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Divider = () => (
  <div className="mx-0.5 w-full border-b-2 border-dashed border-black/30" />
);
