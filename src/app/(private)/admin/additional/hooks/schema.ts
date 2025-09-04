import { z } from "zod";

export const additionalSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, "Nome deve conter pelo menos 3 letras.")
    .max(25, "Digite até 25 caracteres."),
  price: z
    .number({
      errorMap: () => ({ message: "Adicional deve ser um numero." }),
    })
    .int()
    .min(0, "Preço deve ser um numero positivo."),
  priceTemplate: z.string().optional(),
  in_stock: z.boolean().optional().default(true),
});

export type AdditionalType = z.infer<typeof additionalSchema>;
