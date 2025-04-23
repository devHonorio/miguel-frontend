import Link from "next/link";
import { Form } from "./form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ name: string; type: string }>;
}
export default async function Street({ params }: Props) {
  const { name, type } = await params;

  const nameDecode = decodeURI(name);
  const typeDecode = decodeURI(type);
  return (
    <>
      <Link href={`/address/new/${typeDecode}`} className="absolute top-5">
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>

      <h1 className="text-4xl font-bold">Qual numero da casa ou prédio ?</h1>

      <p>Se não tiver numero coloque 0.</p>

      <Form type={typeDecode} name={nameDecode} />
    </>
  );
}
