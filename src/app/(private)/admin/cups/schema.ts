import z from "zod";

export const createCupSchema = z.object({
  size: z.coerce
    .number()
    .min(1, "Tamanho minimo é 1.")
    .int("Numero deve ser um inteiro."),
});

export const updateSchema = createCupSchema.extend({ id: z.string() });

export type CupUpdateType = z.infer<typeof updateSchema>;
export type CreateCupType = z.infer<typeof createCupSchema>;
