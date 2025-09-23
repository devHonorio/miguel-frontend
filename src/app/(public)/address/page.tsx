import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { api } from "../services";
import { ButtonDelete } from "./ButtonDelete";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";

interface AddressProps {
  searchParams: Promise<{
    hour: string;
    paymentMethod: string;
    change: string;
  }>;
}
export default async function Address({ searchParams }: AddressProps) {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;

  const response = await api.get("/address/user", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const addresses = response.data as {
    address_complete: string;
    id: string;
    shipping_price: number;
  }[];

  const { hour, paymentMethod, change } = await searchParams;

  return (
    <div className="flex flex-col flex-wrap content-start gap-5 px-5 py-5">
      <Link href="/orderDetails/hourAndChange">
        <Button variant="secondary">
          <ArrowLeft /> Voltar
        </Button>
      </Link>
      <Card className="h-min">
        <CardContent className="flex items-center gap-2">
          <p className="text-black/80 uppercase">Retirar no local</p>
          <Link
            href={`/address/pick-up-local?hour=${hour}&paymentMethod=${paymentMethod}&change=${change}`}
          >
            <Button variant="secondary" size="icon">
              <ChevronRight />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {addresses.map(({ address_complete, id, shipping_price }) => (
        <Card key={id} className="h-min">
          <CardContent>
            <p className="text-black/80 uppercase">{address_complete}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p>{toCentsInBRL(shipping_price)}</p>

            <div className="space-x-2">
              <ButtonDelete id={id} />

              <Link
                href={`/address/${id}?hour=${hour}&paymentMethod=${paymentMethod}&change=${change}`}
              >
                <Button variant="secondary" size="icon">
                  <ChevronRight />
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}

      <Link href="/address/new">
        <Card className="h-min">
          <CardHeader>
            <CardTitle>Adicionar novo endereço</CardTitle>
          </CardHeader>

          <CardContent>
            <p>Crie um novo endereço</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="icon" className="mx-auto">
              <Plus />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
