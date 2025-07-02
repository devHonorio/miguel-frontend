import User from "@/entities/User";
import z from "zod";

export const loginSchema = z.object({
  phone: z
    .string({
      required_error: "Telefone é obrigatório.",
    })
    .transform((phone) => User.removePhoneStr(phone))
    .refine((phone) => User.phoneValidator(phone), {
      message: "Telefone deve conter 11 dígitos contendo DDD e o digito 9.",
    })
    .transform((phone) => `55${phone}`),
  password: z.string().min(6, "Senha deve conter ao menos 6 dígitos"),
});

export type LoginType = z.infer<typeof loginSchema>;
