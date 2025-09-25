import { PAYMENT_METHOD } from "@/consts";
import z from "zod";

export const cups = z.object({
  id: z
    .string({
      errorMap: () => ({ message: "Tamanho do copo é obrigatório." }),
    })
    .min(1),
  additional: z.array(
    z.object({
      id: z.string({
        errorMap: () => ({ message: "Adicional é obrigatório" }),
      }),
    }),
  ),
  price: z.coerce.number({
    errorMap: () => ({ message: "Preço é obrigatório." }),
  }),
  priceTemplate: z.string().optional(),
});

export const payment = z.object({
  id: z.string().default(""),
  value: z.coerce
    .number({ errorMap: () => ({ message: "Valor é obrigatório." }) })
    .int()
    .min(0, "O valor deve ser maior que R$ 00,00")
    .default(0),
  paymentMethod: z.enum(PAYMENT_METHOD).default("pix"),
  date: z.coerce.date().default(new Date()),
});

export const createOrderSchemaBase = z
  .object({
    clientId: z
      .string({
        errorMap: () => ({ message: "Cliente é obrigatório" }),
      })
      .min(1),
    cups: z.array(cups),
    observations: z.string().optional(),
    isDelivery: z.boolean(),
    addressId: z
      .string({
        errorMap: () => ({ message: "Endereço é obrigatório" }),
      })
      .optional(),
    shippingPrice: z.coerce.number({
      errorMap: () => ({ message: "Preço é obrigatório." }),
    }),
    discount: z.coerce.number(),
    totalPrice: z.coerce
      .number({ errorMap: () => ({ message: "Preço é obrigatório." }) })
      .min(1, "Preço deve ser maior de R$ 1,00."),
    status: z.enum(["rascunho", "confirmar_pedido", "anotado", "cancelado"]),
    hour: z.string({ errorMap: () => ({ message: "Hora é obrigatória" }) }),
    payments: z.array(payment),
    change: z.string().optional(),
    paymentMethod: z.enum(PAYMENT_METHOD),
  })
  .refine(
    ({ isDelivery, shippingPrice }) => {
      if (isDelivery) return shippingPrice > 0;

      return shippingPrice == 0;
    },
    { message: "Preço deve ser maior de R$ 1,00.", path: ["shippingPrice"] },
  );

export const createOrderSchema = createOrderSchemaBase.refine(
  ({ isDelivery, addressId }) => {
    if (isDelivery) return !!addressId;

    return true;
  },
  {
    message: "Endereço é obrigatório se a opção entrega estiver ativa.",
    path: ["addressId"],
  },
);

export type CreateOrderType = z.infer<typeof createOrderSchema>;
