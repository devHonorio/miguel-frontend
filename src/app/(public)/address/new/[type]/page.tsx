import Link from "next/link";
import { Form } from "./form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ type: string }>;
}
export default async function Street({ params }: Props) {
  const { type } = await params;

  const typeDecode = decodeURI(type);
  return (
    <>
      <Link href="/address/new" className="absolute top-5">
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>

      <h1 className="text-4xl font-bold">Qual nome da {typeDecode} ?</h1>
      <Form type={typeDecode} />
    </>
  );
}
