import { CupUpdateType } from "@/app/(private)/admin/cups/schema";
import { api } from "../services";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toBRL } from "@/app/utils";

export default async function Catalog() {
  const response = await api.get<CupUpdateType[]>("/cups");

  const cups = response.data;
  return (
    <>
      {cups?.map(({ id, size, description, price }) => {
        return (
          <div
            key={id}
            className="group w-full max-w-sm space-y-5 rounded-[4rem] bg-white p-10"
          >
            <Image
              src="/acai.png"
              alt="Copo de açai"
              width={200}
              height={200}
              priority
              className="mx-auto transition-all duration-1000 group-hover:-translate-y-5 group-hover:drop-shadow-2xl"
            />
            <div className="text-2xl font-black text-black/60">
              Copo {size}ml
            </div>

            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="line-clamp-3 text-lg font-medium text-black/60">
                  {description}
                </div>
              </HoverCardTrigger>

              <HoverCardContent>{description}</HoverCardContent>
            </HoverCard>

            <div className="text-3xl font-black">{toBRL(price)}</div>
            <Button size="lg" className="rounded-full text-lg font-bold">
              Pedir
            </Button>
          </div>
        );
      })}
    </>
  );
}
