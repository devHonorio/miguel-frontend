import { removeString } from "./removeString";
import { toBRL } from "./toBRL";

export const cleanAndFormatBRL = (templateBRL: string) => {
  const price = removeString(templateBRL);

  if (!price) return "R$ 00,00";

  const priceInCents = +price / 100;

  const priceFormatted = toBRL(priceInCents);

  return priceFormatted;
};
