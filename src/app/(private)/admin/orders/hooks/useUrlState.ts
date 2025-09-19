import Cup from "@/models/cup";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { z } from "zod";
const cupsSchema = z.array(
  z.object({
    id: z.string(),
    additional: z
      .array(
        z.object({
          id: z.string().default(""),
          price: z.coerce.number().default(0),
          label: z.string().default("adicional"),
        }),
      )
      .default([]),
    priceCup: z.coerce.number(),
    label: z.string().default("Tamanho ml"),
    quantityAdditional: z.coerce.number(),
    price: z.coerce.number(),
  }),
);

export const useUrlState = () => {
  const [order, setState] = useQueryStates({
    clientId: parseAsString.withDefault(""),
    clientLabel: parseAsString.withDefault("Selecionar"),
    observations: parseAsString.withDefault(""),
    isDelivery: parseAsBoolean.withDefault(false),
    discount: parseAsInteger.withDefault(0),
    shippingPrice: parseAsInteger.withDefault(0),
    addressId: parseAsString.withDefault(""),
    addressLabel: parseAsString.withDefault("Endereço"),
    cups: parseAsJson(cupsSchema.parse).withDefault([]),
    status: parseAsStringEnum([
      "rascunho",
      "confirmar_pedido",
      "anotado",
      "cancelado",
    ] as const).withDefault("rascunho"),
  });

  const [totalState, setTotal] = useQueryState(
    "total",
    parseAsInteger.withDefault(0),
  );

  type Order = typeof order;

  interface CalculateTotalOrderType {
    discount: number;
    shippingPrice: number;
    cups: Order["cups"];
  }
  const calculateTotalOrder = ({
    discount,
    shippingPrice,
    cups,
  }: CalculateTotalOrderType) => {
    const priceCups = cups.reduce((acc, cup) => acc + cup.price, 0);

    setTotal(-discount + shippingPrice + priceCups);
  };

  const setOrder = (data: Partial<Omit<Order, "cups">>) => {
    setState((prev) => {
      calculateTotalOrder({
        discount: data.discount ?? prev.discount,
        shippingPrice: data.shippingPrice ?? prev.shippingPrice,
        cups: prev.cups,
      });
      return data;
    });
  };

  const addCup = () => {
    setState((prev) => ({
      cups: [
        ...prev.cups,
        {
          additional: [],
          id: "",
          priceCup: 0,
          label: "Tamanho ml",
          quantityAdditional: 0,
          price: 0,
        },
      ],
    }));
  };

  const removeCup = (index: number) => {
    setState((prev) => {
      const cups = prev.cups.filter((_, i) => index !== i);

      prev.cups = cups;

      calculateTotalOrder({
        discount: prev.discount,
        shippingPrice: prev.shippingPrice,
        cups: prev.cups,
      });

      return prev;
    });
  };

  const setCup = (
    index: number,
    {
      cupPrice,
      ...data
    }: {
      id?: string;
      label?: string;
      cupPrice?: number;
      quantityAdditional?: number;
      totalPrice?: number;
    },
  ) => {
    setState((prev) => {
      let currentCup = prev.cups[index];

      currentCup = {
        ...currentCup,
        ...data,
        priceCup: cupPrice || currentCup.priceCup,
      };

      const totalPrice = Cup.getTotalPrice({
        additional: currentCup.additional,
        cupPrice: currentCup.priceCup,
        quantityAdditional: currentCup.quantityAdditional,
      });

      currentCup.price = totalPrice;
      prev.cups[index] = currentCup;

      calculateTotalOrder({
        discount: prev.discount,
        shippingPrice: prev.shippingPrice,
        cups: prev.cups,
      });

      return prev;
    });
  };

  const addAdditional = (cupIndex: number) => {
    setState((prev) => {
      prev.cups[cupIndex].additional = [
        ...prev.cups[cupIndex].additional,
        { id: "", price: 0, label: "adicional" },
      ];

      return prev;
    });
  };

  const removeAdditional = (cupIndex: number, index: number) => {
    setState((prev) => {
      prev.cups[cupIndex].additional = prev.cups[cupIndex].additional.filter(
        (_, i) => i !== index,
      );

      const totalPrice = Cup.getTotalPrice({
        cupPrice: prev.cups[cupIndex].priceCup,
        quantityAdditional: prev.cups[cupIndex].quantityAdditional,
        additional: prev.cups[cupIndex].additional,
      });

      prev.cups[cupIndex].price = totalPrice;

      calculateTotalOrder({
        discount: prev.discount,
        shippingPrice: prev.shippingPrice,
        cups: prev.cups,
      });

      return prev;
    });
  };

  const setAdditional = ({
    cupIndex,
    index,
    data,
  }: {
    data: { id: string; price: number; label: string };
    cupIndex: number;
    index: number;
  }) => {
    setState((prev) => {
      prev.cups[cupIndex].additional[index] = {
        id: data.id,
        price: data.price,
        label: data.label,
      };

      const totalPrice = Cup.getTotalPrice({
        cupPrice: prev.cups[cupIndex].priceCup,
        quantityAdditional: prev.cups[cupIndex].quantityAdditional,
        additional: prev.cups[cupIndex].additional,
      });

      prev.cups[cupIndex].price = totalPrice;

      calculateTotalOrder({
        discount: prev.discount,
        shippingPrice: prev.shippingPrice,
        cups: prev.cups,
      });

      return prev;
    });
  };

  const clearAll = () => {
    setState(null);
    setTotal(null);
  };
  return {
    order: { ...order, total: totalState },
    setOrder,
    addCup,
    removeCup,
    setCup,
    addAdditional,
    removeAdditional,
    setAdditional,
    clearAll,
  };
};
