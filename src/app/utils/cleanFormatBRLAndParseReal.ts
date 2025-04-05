import { removeString } from "./removeString";

export const cleanFormatBRLAndParseReal = (templateBRL: string) => {
 const price = removeString(templateBRL);

 const priceInReal = +price / 100;

  return priceInReal
};
