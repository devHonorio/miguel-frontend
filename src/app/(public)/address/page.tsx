import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Plus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { api } from "../services";
import { ButtonDelete } from "./ButtonDelete";
import { toBRL } from "@/app/utils";

export default async function Address() {
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

  return (
    <div className="flex flex-wrap content-start gap-5 px-5 py-5">
      {addresses.map(({ address_complete, id, shipping_price }) => (
        <Card key={id} className="h-min">
          <CardContent>
            <p className="text-black/80 uppercase">{address_complete}</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p>{toBRL(shipping_price)}</p>

            <div className="space-x-2">
              <ButtonDelete id={id} />

              <Link href={`/address/${id}`}>
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
