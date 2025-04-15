"use client";

import { AdditionalType } from "@/app/(private)/admin/additional/hooks/schema";
import { CupUpdateType } from "@/app/(private)/admin/cups/schema";
import { useOrderStore } from "@/app/store/order";
import { toBRL } from "@/app/utils";
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
}

export const CardCup = ({
  size,
  description,
  price,
  additional,
  quantity_additional,
}: CardCupProps) => {
  const [additionalListId, setAdditionalListId] = useQueryState(
    "additionalListId",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const additionalListUnselected = additional.filter(
    ({ id }) => !additionalListId.includes(id!),
  );

  const additionalListSelected = additional.filter(({ id }) =>
    additionalListId.includes(id!),
  );

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
          {additionalListId?.map((additionalId) => {
            const currentAdditional = additional.find(
              ({ id }) => id === additionalId,
            );
            return (
              <Button
                key={additionalId}
                className="rounded-full"
                onClick={() => {
                  setAdditionalListId(
                    additionalListId.filter(
                      (id) => id !== currentAdditional?.id,
                    ),
                  );
                }}
              >
                <Check /> {currentAdditional?.name}{" "}
                {currentAdditional!.price > 0 &&
                  toBRL(currentAdditional!.price)}
              </Button>
            );
          })}

          {additionalListId.length < quantity_additional &&
            additionalListUnselected.map(({ name, id, price }) => (
              <Button
                key={id}
                className="rounded-full border-2 border-dashed"
                variant="ghost"
                onClick={() => {
                  setAdditionalListId([...additionalListId, id!]);
                }}
              >
                <Plus /> {name} {price > 0 && toBRL(price)}
              </Button>
            ))}
        </div>
      </CardCupContainer>

      <div className="flex gap-5 rounded-4xl bg-white p-10">
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
                id: crypto.randomUUID(),
                price: priceCup,
                size,
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
