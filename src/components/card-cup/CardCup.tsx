import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import Link from "next/link";
import { Button } from "../ui/button";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";

interface CardCupProps {
  id: string;
  description: string;
  price: number;
  size: number;
}

export const CardCup = ({ description, id, price, size }: CardCupProps) => {
  return (
    <CardCupContainer>
      <CardCupImage />
      <CardCupSize>{size}</CardCupSize>

      <CardCupDescription>{description}</CardCupDescription>

      <CardCupPrice price={price} />

      <Link href={`cup/${id}`}>
        <Button size="lg" className="rounded-full text-lg font-bold">
          Pedir
        </Button>
      </Link>
    </CardCupContainer>
  );
};

interface Children {
  children: React.ReactNode;
}

export const CardCupContainer = ({ children }: Children) => {
  return (
    <div className="group h-min w-full max-w-sm space-y-5 rounded-[4rem] bg-white p-10">
      {children}
    </div>
  );
};

export const CardCupImage = () => {
  return (
    <Image
      src="/acai.png"
      alt="Copo de açaí"
      width={200}
      height={200}
      priority
      className="mx-auto transition-all duration-1000 group-hover:-translate-y-5 group-hover:drop-shadow-2xl"
    />
  );
};

export const CardCupSize = ({
  children,
  className,
}: Children & { className?: string }) => {
  return (
    <div className={`text-2xl font-black text-black/60 ${className}`}>
      Copo {children}ml
    </div>
  );
};

export const CardCupDescription = ({ children }: Children) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="line-clamp-3 text-lg font-medium text-black/60">
          {children}
        </div>
      </HoverCardTrigger>

      <HoverCardContent>{children}</HoverCardContent>
    </HoverCard>
  );
};

export const CardCupPrice = ({
  price,
  className,
}: {
  price: number;
  className?: string;
}) => {
  return (
    <div className={`text-3xl font-black ${className}`}>
      {toCentsInBRL(price)}
    </div>
  );
};
