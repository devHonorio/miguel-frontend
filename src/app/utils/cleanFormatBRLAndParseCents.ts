import { removeString } from "./removeString";

export const cleanFormatBRLAndParseCents = (templateBRL: string) => {
  return +removeString(templateBRL);
};
