"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, PlusCircle } from "lucide-react";
import { FormCreate } from "./components/form-create";
import { parseAsBoolean, useQueryStates } from "nuqs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useList } from "./hooks/query/useList";
import { toBRL } from "@/app/utils";

export default function Additional() {
  const [additionalStates, setAdditionalStates] = useQueryStates({
    modalCreate: parseAsBoolean.withDefault(false),
  });
  const { data, isLoading } = useList();

  return (
    <div className="flex flex-col gap-2">
      <Dialog
        open={additionalStates.modalCreate}
        onOpenChange={(open) => setAdditionalStates({ modalCreate: open })}
      >
        <DialogTrigger asChild>
          <Button>
            Adicionar adicional <PlusCircle />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar adicional</DialogTitle>
          </DialogHeader>

          <FormCreate />
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço/R$</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={2}>
                <Loader2 className="animate-spin" />
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            data?.map(({ id, name, price }) => (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>{toBRL(price)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
