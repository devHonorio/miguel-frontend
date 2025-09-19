"use client";
import { Control, Path, useFormState } from "react-hook-form";
import { CreateOrderType } from "../../schema";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

import { AdditionalForm } from "./form-additional";
import { Select } from "@/components/select";
import { useCups } from "../../hooks/query/useCups";

import { useUrlState } from "../../hooks/useUrlState";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";

interface CupsFormProps {
  control: Control<CreateOrderType>;
}
import { ErrorMessage } from "@hookform/error-message";

const MessageError = ({
  control,
  name,
}: {
  control: Control<CreateOrderType>;
  name: Path<CreateOrderType>;
}) => {
  const { errors } = useFormState({ control });
  return (
    <ErrorMessage
      name={name}
      errors={errors}
      render={({ message }) => (
        <p className="text-sm text-red-500">{message}</p>
      )}
    />
  );
};

export const CupsForm = ({ control }: CupsFormProps) => {
  const { errors } = useFormState({ control });

  const { order, setCup, addCup, removeCup } = useUrlState();

  const { data, isLoading } = useCups();

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-lg font-bold">Copos</Label>
      {order.cups.map((_, i) => {
        return (
          <div
            key={crypto.randomUUID()}
            className="flex flex-col gap-2 rounded-xl border-2 border-dashed p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              {!data && isLoading && <Loader2 className="animate-spin" />}
              {data && !isLoading && (
                <div>
                  <Select
                    data={data.map(({ id, size }) => ({
                      label: `${size}ml`,
                      value: id,
                    }))}
                    label={order.cups[i].label}
                    size="sm"
                    onSelect={(id, label) => {
                      const currentCup = data?.find((cup) => cup.id === id);

                      if (!currentCup) {
                        return console.error("Copo atual não encontrado.");
                      }

                      setCup(i, {
                        id,
                        label,
                        cupPrice: currentCup.price,
                        quantityAdditional: currentCup.quantity_additional,
                      });
                    }}
                  />
                  <MessageError control={control} name={`cups.${i}.id`} />
                </div>
              )}

              <AdditionalForm control={control} index={i} />
              <div className="flex w-full flex-col">
                <p
                  className="font-black data-[error=true]:text-red-500"
                  data-error={!!errors.totalPrice?.message}
                >
                  Total {toCentsInBRL(order.cups[i].price)}
                </p>

                <MessageError control={control} name={`cups.${i}.price`} />
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="border-none text-red-600"
              onClick={() => {
                removeCup(i);
              }}
            >
              Remover copo <Trash2 />
            </Button>
          </div>
        );
      })}
      <Button
        className="border-dashed border-black/50 text-black/50"
        type="button"
        size="sm"
        variant="outline"
        onClick={() => {
          addCup();
        }}
      >
        Adiciona copo
        <Plus />
      </Button>
    </div>
  );
};
