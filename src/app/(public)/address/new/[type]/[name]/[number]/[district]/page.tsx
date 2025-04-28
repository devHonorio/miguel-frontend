import Link from "next/link";
import { Form } from "./form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{
    name: string;
    type: string;
    number: number;
    district: string;
  }>;
}

export default async function Complement({ params }: Props) {
  const { type, name, number, district } = await params;

  const typeDecode = decodeURI(type);
  const nameDecode = decodeURI(name);
  const districtDecode = decodeURI(district);

  const path =
    typeDecode === "linha"
      ? `/address/new/linha`
      : `/address/new/${type}/${name}`;

  return (
    <>
      <Link href={path} className="absolute top-5">
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>

      <h1 className="text-4xl font-bold">Qual nome da cidade?</h1>

      <p className="capitalize">
        {typeDecode} {nameDecode} - {number}, {districtDecode}
      </p>

      <Form
        type={typeDecode}
        name={nameDecode}
        number={number}
        district={districtDecode}
      />
    </>
  );
}
