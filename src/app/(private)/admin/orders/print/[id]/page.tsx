"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ResponseOrder } from "../../page";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import User from "@/entities/User";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Courier_Prime } from "next/font/google";
import { PaymentMethod } from "../../components/form-create";
import { cleanFormatBRLAndParseCents } from "@/app/utils/cleanFormatBRLAndParseCents";
import { getOrder } from "@/app/services/orders/getOrder";

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function Print() {
  const { id } = useParams<{ id: string }>();

  const { isLoading, data } = useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      return (await getOrder(id)) as ResponseOrder;
    },
  });

  const { back } = useRouter();

  const [showButtons, setShowButtons] = useState(true);

  const paid = data?.payments.reduce((acc, { value }) => value + acc, 0) ?? 0;

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
          <div className="flex flex-col gap-5">
            {data?.cups.map(({ label, additional, total_price }, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-baseline">
                  <div className="font-bold">{label}</div>
                  <Divider />
                  <div className="font-bold">{toCentsInBRL(total_price)}</div>
                </div>
                <div>
                  {additional.map((additional) => (
                    <div
                      key={additional.id}
                      className="flex items-center gap-2"
                    >
                      <div>-</div> {additional.label}
                    </div>
                  ))}
                </div>
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

          <div className="border-2 border-black p-2 font-bold">
            <div>Pagamento no {PaymentMethod[data!.payment_method]}</div>

            {data?.payment_method === "cash" && (
              <div>
                {cleanFormatBRLAndParseCents(data.change) > 0 &&
                  ` Levar ${toCentsInBRL(
                    cleanFormatBRLAndParseCents(data.change) - data.total_price,
                  )} em troco`}
                {!cleanFormatBRLAndParseCents(data.change) &&
                  "Não precisa troco"}
              </div>
            )}
          </div>
          <div>
            <Divider />
            <div className="flex justify-between font-black">
              <div>Total:</div>
              <div>{toCentsInBRL(data?.total_price || 0)}</div>
            </div>

            <div className="my-5">
              {data?.payments.map((payment) => (
                <div key={payment.id} className="flex justify-between gap-2">
                  <div>Pago {PaymentMethod[payment.paymentMethod]}:</div>

                  <div>{new Date(payment.date).toLocaleDateString()}</div>
                  <div>{toCentsInBRL(payment.value)}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-between border-2 border-black p-2 font-bold">
              <div>Restante a pagar:</div>

              {toCentsInBRL((data?.total_price ?? 0) - paid)}
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
