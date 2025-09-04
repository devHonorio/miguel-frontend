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
