import z from "zod";

export const codeSchema = z.object({
  code: z
    .string({ errorMap: () => ({ message: "Digite os quatro números." }) })
    .min(4)
    .max(4),
});

export type CodeType = z.infer<typeof codeSchema>;
