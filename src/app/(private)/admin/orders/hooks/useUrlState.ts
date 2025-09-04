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
    additional: z.array(
      z.object({
        id: z.string(),
        price: z.coerce.number(),
        label: z.string(),
      }),
    ),
    price: z.coerce.number(),
    label: z.string().default("Tamanho ml"),
    quantityAdditional: z.coerce.number(),
    totalPrice: z.coerce.number(),
  }),
);

interface OrderDefault {
  clientId?: string;
  clientLabel?: string;
  observations?: string;
  isDelivery?: boolean;
  discount?: number;
  shippingPrice?: number;
  addressId?: string;
  addressLabel?: string;
  cups?: z.infer<typeof cupsSchema>;
  status?: "rascunho" | "confirmar_pedido" | "anotado" | "cancelado";
  total?: number;
}

export const useUrlState = (data?: OrderDefault) => {
  const [order, setState] = useQueryStates({
    clientId: parseAsString.withDefault(data?.clientId ?? ""),
    clientLabel: parseAsString.withDefault(data?.clientLabel ?? "Selecionar"),
    observations: parseAsString.withDefault(data?.observations ?? ""),
    isDelivery: parseAsBoolean.withDefault(data?.isDelivery ?? false),
    discount: parseAsInteger.withDefault(data?.discount ?? 0),
    shippingPrice: parseAsInteger.withDefault(data?.shippingPrice ?? 0),
    addressId: parseAsString.withDefault(data?.addressId ?? ""),
    addressLabel: parseAsString.withDefault(data?.addressLabel ?? "Endereço"),
    cups: parseAsJson(cupsSchema.parse).withDefault(data?.cups ?? []),
    status: parseAsStringEnum([
      "rascunho",
      "confirmar_pedido",
      "anotado",
      "cancelado",
    ] as const).withDefault(data?.status ?? "rascunho"),
  });

  const [totalState, setTotal] = useQueryState(
    "total",
    parseAsInteger.withDefault(data?.total ?? 0),
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
    const priceCups = cups.reduce((acc, cup) => acc + cup.totalPrice, 0);

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
          price: 0,
          label: "Tamanho ml",
          quantityAdditional: 0,
          totalPrice: 0,
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
        price: cupPrice || currentCup.price,
      };

      const totalPrice = Cup.getTotalPrice({
        additional: currentCup.additional,
        cupPrice: currentCup.price,
        quantityAdditional: currentCup.quantityAdditional,
      });

      currentCup.totalPrice = totalPrice;
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
        cupPrice: prev.cups[cupIndex].price,
        quantityAdditional: prev.cups[cupIndex].quantityAdditional,
        additional: prev.cups[cupIndex].additional,
      });

      prev.cups[cupIndex].totalPrice = totalPrice;

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
        cupPrice: prev.cups[cupIndex].price,
        quantityAdditional: prev.cups[cupIndex].quantityAdditional,
        additional: prev.cups[cupIndex].additional,
      });

      prev.cups[cupIndex].totalPrice = totalPrice;

      calculateTotalOrder({
        discount: prev.discount,
        shippingPrice: prev.shippingPrice,
        cups: prev.cups,
      });

      return prev;
    });
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
  };
};
