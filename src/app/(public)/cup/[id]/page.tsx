import { api } from "../../services";
import { CupUpdateType } from "@/app/(private)/admin/cups/schema";
import { AdditionalType } from "@/app/(private)/admin/additional/hooks/schema";

import { CardCup } from "./components/card-cup";

interface CupProps {
  params: Promise<{ id: string }>;
}

const getCup = async (id: string) =>
  await api.get<CupUpdateType>(`/cups/${id}`);
const getAdditional = async () =>
  await api.get<AdditionalType[]>("/additional");
export default async function Cup({ params }: CupProps) {
  const { id } = await params;

  const response = await Promise.all([getCup(id), getAdditional()]);

  const cup = response[0].data;

  const additional = response[1].data;

  return (
    <div className="bg-primary/5 flex w-full flex-col items-center gap-5 p-5">
      <CardCup
        cup_id={id}
        additional={additional}
        description={cup.description}
        price={cup.price}
        size={cup.size}
        quantity_additional={cup.quantity_additional}
      />
    </div>
  );
}
