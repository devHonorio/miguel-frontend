"use client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useQuery } from "./useQuery";

export default function Cups() {
  const { data, isPending } = useQuery();

  return (
    <div className="mx-auto flex w-md flex-col gap-5">
      <Link href="/admin/cups/create">
        <Button>
          Adicionar copo <PlusCircle />
        </Button>
      </Link>

      <Table>
        <TableCaption>Copos cadastrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tamanho/ml</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending && (
            <TableRow>
              <TableCell align="center" className="py-5">
                <Loader2 className="animate-spin" />
              </TableCell>
            </TableRow>
          )}
          {data?.map(({ size }) => (
            <TableRow key={size}>
              <TableCell>{size}ml</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
