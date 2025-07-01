import User from "@/entities/User";
import z from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .transform((name) => User.removeUnwantedCharactersOfName(name))
    .refine((name) => User.haveNameAndLastName(name), {
      message: "Digite seu nome completo.",
    })
    .refine((name) => User.validationLengthName(name), {
      message: "Nome não deve ter abreviações.",
    }),
});

export type SignupType = z.infer<typeof signupSchema>;
