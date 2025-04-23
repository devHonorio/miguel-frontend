import Link from "next/link";
import { Form } from "./form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ name: string; type: string; number: number }>;
}

export default async function Complement({ params }: Props) {
  const { type, name, number } = await params;

  const typeDecode = decodeURI(type);
  const nameDecode = decodeURI(name);

  return (
    <>
      <Link href={`/address/new/${type}/${name}`} className="absolute top-5">
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>
      <p className="text-xl font-bold capitalize">
        {typeDecode} {nameDecode} - {number}
      </p>

      <Form type={typeDecode} name={nameDecode} number={number} />
    </>
  );
}
