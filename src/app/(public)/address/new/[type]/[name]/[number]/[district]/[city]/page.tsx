"use client";
import Link from "next/link";
import { Form } from "./form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";
import { ButtonSetAddress } from "./ButtonSetAddress";
import { getSearchAddresses } from "@/app/services/addresses/getSearchAddresses";

interface Params extends ParsedUrlQuery {
  name: string;
  type: string;
  number: string;
  city: string;
  district: string;
}

export default function Complement() {
  const params = useParams<Params>();

  const { type, name, number, city, district } = params;

  const typeDecode = decodeURI(type);
  const nameDecode = decodeURI(name);
  const districtDecode = decodeURI(district);
  const cityDecode = decodeURI(city);

  const { data, isLoading } = useQuery<
    {
      id: string;
      address_complete: string;
      complement: string;
    }[]
  >({
    queryKey: ["complements"],
    queryFn: async () => {
      return await getSearchAddresses(
        `${typeDecode} ${nameDecode} - ${number}, ${districtDecode}, ${cityDecode}`,
      );
    },
    initialData: [],
  });

  const path =
    type === "linha"
      ? `/address/new/${type}/${name}/0/zona rural`
      : `/address/new/${type}/${name}/${number}/${district}`;

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setShowForm(!data.length);
  }, [isLoading, data.length]);

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <>
      <Link href={path} className="absolute top-5">
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>

      <p className="text-xl font-bold capitalize">
        {typeDecode} {nameDecode} - {number}, {districtDecode}, {cityDecode}
      </p>

      {data.length > 0 && !showForm && (
        <>
          <h1>Qual dessas referências é perto da sua casa?</h1>
          <div className="space-y-2">
            {data?.map(({ id, complement }, i) => (
              <ButtonSetAddress
                key={id}
                id={id}
                complement={complement}
                index={i}
              />
            ))}

            <div
              className="flex gap-2 rounded-md bg-black/5 px-4 py-2"
              onClick={() => setShowForm(true)}
            >
              <div>{data.length + 1} - </div>
              <p className="capitalize">Nenhuma das opções.</p>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <Form
          type={typeDecode}
          name={nameDecode}
          number={+number}
          city={cityDecode}
          district={districtDecode}
        />
      )}
    </>
  );
}
