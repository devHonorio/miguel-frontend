"use client";
import Link from "next/link";
import { Form } from "./form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useApi } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ParsedUrlQuery } from "querystring";

interface Params extends ParsedUrlQuery {
  name: string;
  type: string;
  number: string;
  city: string;
  district: string;
}

export default function Complement() {
  const { api } = useApi();

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
      const response = await api.get(
        `/address/search/${typeDecode} ${nameDecode} - ${number}, ${districtDecode}, ${cityDecode}`,
      );

      return response.data;
    },
    initialData: [],
  });

  const path =
    type === "linha"
      ? `/address/new/${type}/${name}/0/zona rural`
      : `/address/new/${type}/${name}/${number}/${district}`;
  const [showForm, setShowForm] = useState(!!data.length || isLoading);

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
              <div
                key={id}
                className="flex gap-2 rounded-md bg-black/5 px-4 py-2"
              >
                <div>{i + 1} - </div>
                <p className="capitalize">{complement}</p>
              </div>
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
