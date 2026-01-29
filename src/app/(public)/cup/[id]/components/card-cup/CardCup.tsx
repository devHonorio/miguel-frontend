"use client";

import { AdditionalType } from "@/app/(private)/admin/additional/hooks/schema";
import { CupUpdateType } from "@/app/(private)/admin/cups/schema";
import { useOrderStore } from "@/app/store/order";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import {
  CardCupContainer,
  CardCupDescription,
  CardCupImage,
  CardCupPrice,
  CardCupSize,
} from "@/components/card-cup";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

interface CardCupProps
  extends Pick<
    CupUpdateType,
    "description" | "price" | "size" | "quantity_additional"
  > {
  additional: AdditionalType[];
  cup_id: string;
}

export const CardCup = ({
  size,
  description,
  price,
  additional,
  quantity_additional,

  cup_id,
}: CardCupProps) => {
  const [additionalListId, setAdditionalListId] = useQueryState(
    "additionalListId",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const additionalCurrentWithPrice = additional.map(({ id }) => {
    const currentAdditional = additional.find((add) => id === add.id);

    if (!currentAdditional) {
      throw new Error("Adicional não encontrado.");
    }
    return { ...currentAdditional };
  });

  let countAdditionalFree = 0;

  const additionalListSelected = additionalCurrentWithPrice
    .filter(({ id }) => additionalListId.includes(id!))
    .map((add) => {
      if (add.price > 0) return add;

      if (countAdditionalFree < quantity_additional) {
        countAdditionalFree++;

        return add;
      }
      return { ...add, price: 200 };
    });

  const additionalListUnselected = additionalCurrentWithPrice
    .filter(({ id }) => !additionalListId.includes(id!))
    .map((add) => {
      if (add.price > 0) return add;

      if (countAdditionalFree >= quantity_additional) {
        return { ...add, price: 200 };
      }
      return add;
    });

  const priceCup =
    price + additionalListSelected.reduce((acc, { price }) => acc + price, 0);

  const { addCup } = useOrderStore();
  return (
    <>
      <CardCupContainer>
        <CardCupImage />

        <CardCupSize>{size}</CardCupSize>

        <CardCupDescription>{description}</CardCupDescription>

        <CardCupPrice price={priceCup} />

        <div className="flex flex-wrap gap-2">
          {additionalListSelected?.map(({ id, name, price }) => {
            return (
              <Button
                key={id}
                className="rounded-full"
                onClick={() => {
                  setAdditionalListId(
                    additionalListId.filter((addId) => addId !== id),
                  );
                }}
              >
                <Check /> {name} {price > 0 && toCentsInBRL(price)}
              </Button>
            );
          })}

          {additionalListUnselected.map(({ name, id, price }) => {
            return (
              <Button
                key={id}
                className="rounded-full border-2 border-dashed"
                variant="ghost"
                onClick={() => {
                  setAdditionalListId([...additionalListId, id!]);
                }}
              >
                <Plus /> {name} {price > 0 && toCentsInBRL(price)}
              </Button>
            );
          })}
        </div>
      </CardCupContainer>

      <div className="py-14" />

      <div className="fixed bottom-5 flex gap-5 rounded-4xl bg-white p-10 shadow">
        <Link href="/orderDetails">
          <Button
            variant="outline"
            onClick={() => {
              addCup({
                additional: additionalListId.map((id) => {
                  const currentAdditional = additional.find(
                    (add) => add.id === id,
                  );

                  return {
                    name: currentAdditional!.name,
                    id: currentAdditional?.id,
                  };
                }),
                cup_id,
                price: priceCup,
                size,
                id: crypto.randomUUID(),
              });
            }}
          >
            Finalizar pedido
          </Button>
        </Link>

        <Link href="/catalogo">
          <Button
            variant="secondary"
            onClick={() => {
              addCup({
                additional: additionalListId.map((id) => {
                  const currentAdditional = additional.find(
                    (add) => add.id === id,
                  );

                  return {
                    name: currentAdditional!.name,
                    id: currentAdditional?.id,
                  };
                }),
                id: crypto.randomUUID(),
                price: priceCup,
                size,
                cup_id,
              });
            }}
          >
            Adicionar mais um
          </Button>
        </Link>
      </div>
    </>
  );
};
