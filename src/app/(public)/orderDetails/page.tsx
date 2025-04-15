"use client";
import { useOrderStore } from "@/app/store/order";
import { toBRL } from "@/app/utils";
import {
  CardCupContainer,
  CardCupDescription,
  CardCupPrice,
  CardCupSize,
} from "@/components/card-cup";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next/client";
import { CupSoda, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrderDetails() {
  const { cups, removeCup } = useOrderStore();

  const cupsPrice = cups.reduce((acc, cup) => acc + cup.price, 0);

  const [token, setToken] = useState(false);

  useEffect(() => {
    const tokenCookie = getCookie("token");
    console.log({ tokenCookie });
    setToken(!!tokenCookie);
  }, []);

  return (
    <div className="bg-primary/5 flex w-full flex-col items-center gap-10 pt-6 pb-48">
      {!cups.length && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <ShoppingCart className="h-24 w-24 text-black/60" />
          <p className="text-xl">Carrinho vazio</p>
        </div>
      )}
      {cups.map(({ size, price, additional, id }) => (
        <CardCupContainer key={id}>
          <div className="bg-primary -mt-12 flex gap-2 rounded-full p-5 text-white">
            <CupSoda />
            <CardCupSize className="text-white">{size}</CardCupSize>
          </div>

          <CardCupDescription>
            {additional.map((add) => add.name).join(", ")}
          </CardCupDescription>

          <div className="flex justify-between">
            <CardCupPrice price={price} />
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={() => removeCup(id)}
            >
              <Trash2 />
            </Button>
          </div>
        </CardCupContainer>
      ))}

      <div className="fixed right-0 bottom-0 left-0 flex flex-col items-end gap-5 bg-white p-10">
        {!!cups.length && (
          <p className="text-xl font-black text-black/70">{toBRL(cupsPrice)}</p>
        )}
        <div className="space-x-2">
          {!!cups.length && (
            <Link href={token ? "/address" : "/login"}>
              <Button variant="outline" size="lg">
                Continuar
              </Button>
            </Link>
          )}

          <Link href="/catalogo">
            <Button variant="secondary" size="lg">
              Adicionar mais um
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
