import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";

export default function Address() {
  return (
    <div className="flex flex-wrap content-start gap-5 px-5 py-5">
      {Array.from({ length: 0 }).map((_, i) => (
        <Card key={i} className="h-min">
          <CardHeader>
            <CardTitle>Minha Casa</CardTitle>
          </CardHeader>

          <CardContent>
            <p>Rua Papa João Paulo II - 538, Água Verde, Ampére</p>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p>R$ 4,00</p>
            <Button variant="secondary" size="icon">
              <ChevronRight />
            </Button>
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
