import { api } from "../../services";
import { CupUpdateType } from "@/app/(private)/admin/cups/schema";
import { AdditionalType } from "@/app/(private)/admin/additional/hooks/schema";

import { CardCup } from "./components/card-cup";

interface CupProps {
  params: Promise<{ id: string }>;
}

const getCup = async (id: string) =>
  await api.get<CupUpdateType>(`/cups/${id}`);

const getAdditional = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/additional`,
    {
      next: { tags: ["additional"] },
    },
  );

  const additional = (await response.json()) as AdditionalType[];
  return additional;
};

export default async function Cup({ params }: CupProps) {
  const { id } = await params;

  const response = await Promise.all([getCup(id), getAdditional()]);

  const cup = response[0].data;

  const additional = response[1];

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

export async function generateStaticParams() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cups`, {
    next: { tags: ["cups-id"] },
  });

  const cups = (await response.json()) as { id: string }[];

  return cups.map(({ id }) => ({
    id,
  }));
}
