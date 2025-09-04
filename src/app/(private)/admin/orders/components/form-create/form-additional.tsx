"use client";
import { Control } from "react-hook-form";
import { CreateOrderType } from "../../schema";
import { Combobox } from "@/components/combobox";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, XCircle } from "lucide-react";
import { useUrlState } from "../../hooks/useUrlState";
import { useQuery } from "@tanstack/react-query";
import { Additional } from "../../../additional/hooks/query/useList";
import { toBRL } from "@/app/utils";
import { useApi } from "@/hooks";

interface AdditionalFormProps {
  index: number;
  control: Control<CreateOrderType>;
}

export const AdditionalForm = ({ index }: AdditionalFormProps) => {
  const { api } = useApi();

  const { order, addAdditional, removeAdditional, setAdditional } =
    useUrlState();

  const { data, isLoading } = useQuery<Additional[]>({
    queryKey: ["additional"],
    queryFn: async () => {
      const response = await api.get("/additional");

      return response.data;
    },
  });

  const currentCup = order.cups[index];

  return (
    <>
      {currentCup.additional.map(({ id, label }, i) => {
        return (
          <div key={crypto.randomUUID()} className="flex gap-1">
            {!data && isLoading && <Loader2 className="animate-spin" />}
            {data && !isLoading && (
              <Combobox
                data={data.map(({ id, name, price }) => ({
                  value: id,
                  label: name,
                  complement: price ? toBRL(price) : undefined,
                }))}
                size="sm"
                label={label}
                value={id}
                onSelect={(value) => {
                  const currentAdditional = data.find(
                    (add) => add.id === value,
                  )!;
                  setAdditional({
                    cupIndex: index,
                    index: i,
                    data: {
                      id: value,
                      price: currentAdditional.price * 100,
                      label: currentAdditional.name,
                    },
                  });
                }}
              />
            )}

            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => removeAdditional(index, i)}
            >
              <XCircle className="text-red-600" />
            </Button>
          </div>
        );
      })}
      <Button
        className="border-2 border-dashed"
        type="button"
        size="icon"
        variant="outline"
        onClick={() => addAdditional(index)}
      >
        <Plus />
      </Button>
    </>
  );
};
