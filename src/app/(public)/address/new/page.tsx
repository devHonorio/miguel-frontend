import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const types = ["rua", "avenida", "linha"];
export default function TypeAddress() {
  return (
    <>
      <Link href="/address" className="absolute top-5">
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>
      <h1 className="text-4xl font-bold">Qual tipo de endereço ?</h1>

      <div className="flex flex-col gap-2">
        {types.map((typeAddress) => (
          <Link key={typeAddress} href={`/address/new/${typeAddress}`}>
            <Button className="capitalize" variant="outline">
              {typeAddress}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
}
