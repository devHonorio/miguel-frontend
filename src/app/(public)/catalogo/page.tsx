import { CupUpdateType } from "@/app/(private)/admin/cups/schema";
import { api } from "../services";

import { CardCup } from "@/components/card-cup";

export default async function Catalog() {
  const response = await api.get<CupUpdateType[]>("/cups");

  const cups = response.data;
  return (
    <>
      {cups?.map(({ id, size, description, price }) => (
        <CardCup
          key={id}
          description={description}
          id={id}
          price={price}
          size={size}
        />
      ))}
    </>
  );
}
