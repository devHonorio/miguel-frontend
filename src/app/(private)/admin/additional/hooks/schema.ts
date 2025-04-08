import { z } from "zod";

export const additionalSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve conter pelo menos 3 letras.")
    .max(25, "Digite até 25 caracteres."),
  price: z
    .number({
      errorMap: () => ({ message: "Adicional deve ser um numero." }),
    })
    .min(0, "Preço deve ser um numero positivo."),
  priceTemplate: z.string().optional(),
});

export type AdditionalType = z.infer<typeof additionalSchema>;
