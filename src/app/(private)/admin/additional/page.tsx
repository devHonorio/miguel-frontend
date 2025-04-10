"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ellipsis, Loader2, PlusCircle, Trash2 } from "lucide-react";
import { FormCreate } from "./components/form-create";
import { parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDelete } from "./hooks/query/useDelete";

export default function Additional() {
  const [additionalStates, setAdditionalStates] = useQueryStates({
    modalCreate: parseAsBoolean.withDefault(false),

    modalAlertDelete: parseAsBoolean.withDefault(false),
    ideDelete: parseAsString.withDefault(""),
  });
  const { data, isLoading } = useList();

  const { isPending, mutate } = useDelete();

  return (
    <>
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
            <TableHead>Em estoque</TableHead>
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
            data?.map(({ id, name, price, in_stock }) => (
              <TableRow key={id}>
                <TableCell>{name}</TableCell>
                <TableCell>{toBRL(price)}</TableCell>
                <TableCell>{in_stock ? "sim" : "não"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          setAdditionalStates({
                            ideDelete: id,
                            modalAlertDelete: true,
                          })
                        }
                      >
                        Apagar <Trash2 />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={additionalStates.modalAlertDelete}
        onOpenChange={(open) => setAdditionalStates({ modalAlertDelete: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja apagar?</AlertDialogTitle>
            <AlertDialogDescription>
              Se você apagar esse adicional, ele também será apagado no
              histórico dos pedidos.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button
              onClick={() => {
                mutate(additionalStates.ideDelete);
              }}
              disabled={isPending}
            >
              Apagar mesmo assim
              {isPending && <Loader2 className="animate-spin" />}
            </Button>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
