import z from "zod";

export const addressSchema = z.object({
  street: z
    .string({ errorMap: () => ({ message: "Rua é obrigatório." }) })
    .max(200, "Nome da rua deve ter menos de 200 letras.")
    .min(3, "Nome da rua deve ter pelo menos 3 letras.")
    .transform((street) => street.toLocaleLowerCase()),
  number: z.coerce
    .number({ errorMap: () => ({ message: "Numero é obrigatório." }) })
    .int("Numero deve ser um inteiro.")
    .min(0, "Numero deve ser um numero positivo."),
  district: z
    .string({ errorMap: () => ({ message: "Bairro é obrigatório." }) })
    .max(200, "Bairro deve ter menos de 200 letras.")
    .min(3, "Bairro deve ter pelo menos 3 letras.")
    .transform((street) => street.toLocaleLowerCase()),
  complement: z
    .string()
    .max(200, "Complemento deve ter menos de 300 letras.")
    .min(3, "Complemento deve ter pelo menos 3 letras.")
    .optional()
    .transform((street) => {
      if (!street) return;
      return street.toLocaleLowerCase();
    }),
  city: z
    .string({ errorMap: () => ({ message: "Cidade é obrigatório." }) })
    .max(200, "Cidade deve ter menos de 200 letras.")
    .min(3, "Cidade deve ter pelo menos 3 letras.")
    .transform((street) => street.toLocaleLowerCase()),
  shipping_price: z.coerce
    .number({ errorMap: () => ({ message: "Preço é obrigatório" }) })
    .int()
    .positive("Preço deve ser maior que R$ 00,00."),
  priceTemplate: z.string(),
});

export type CreateAddressType = z.infer<typeof addressSchema>;
