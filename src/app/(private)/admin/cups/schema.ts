import z from "zod";

export const createCupSchema = z.object({
  size: z.coerce
    .number()
    .min(1, "Tamanho minimo é 1.")
    .int("Numero deve ser um inteiro."),
  price: z.coerce.number().min(1, "Preço deve ser maior de R$ 1,00."),
  priceTemplate: z.string().optional(),
  in_stock: z.boolean(),
  description: z
    .string()
    .min(3, "Descrição deve ter mais de 3 caracteres")
    .max(200, "Descrição deve ter menos de 200 caracteres"),
});

export const updateSchema = createCupSchema.extend({ id: z.string() });

export type CupUpdateType = z.infer<typeof updateSchema>;
export type CreateCupType = z.infer<typeof createCupSchema>;
