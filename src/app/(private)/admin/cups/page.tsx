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
import { Edit, EllipsisIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useDelete, useGet } from "./hooks/query";
import { FormCreate } from "./components/form-create";
import { FormUpdate } from "./components/form-update";
import { toBRL } from "@/app/utils";

export default function Cups() {
  const { data, isPending } = useGet();
  const { mutate, isPending: isPendingDelete } = useDelete();

  const [cupStates, setCupStates] = useQueryStates({
    modalCreate: parseAsBoolean.withDefault(false),
    modalUpdate: parseAsBoolean.withDefault(false),
    modalAlertDelete: parseAsBoolean.withDefault(false),

    idUpdate: parseAsString.withDefault(""),
    sizeDelete: parseAsInteger.withDefault(0),
  });

  return (
    <>
      <Dialog
        open={cupStates.modalCreate}
        onOpenChange={(open) => setCupStates({ modalCreate: open })}
      >
        <DialogTrigger asChild>
          <Button>
            Adicionar copo <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar copo</DialogTitle>
          </DialogHeader>
          <FormCreate />
        </DialogContent>
      </Dialog>

      <Dialog
        open={cupStates.modalUpdate}
        onOpenChange={(open) =>
          setCupStates({ modalUpdate: open, idUpdate: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar copo </DialogTitle>
          </DialogHeader>

          <FormUpdate id={cupStates.idUpdate} />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={cupStates.modalAlertDelete}
        onOpenChange={(open) => setCupStates({ modalAlertDelete: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja apagar?</AlertDialogTitle>
            <AlertDialogDescription>
              Se você apagar esse copo, ele também será apagado no histórico dos
              pedidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                mutate(cupStates.sizeDelete);
                setCupStates({ modalAlertDelete: true });
              }}
              disabled={isPending}
            >
              Apagar mesmo assim
              {isPendingDelete && <Loader2 className="animate-spin" />}
            </Button>
            <AlertDialogCancel>Cacelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Table>
        <TableCaption>Copos cadastrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tamanho/ml</TableHead>
            <TableHead>Preço/R$</TableHead>
            <TableHead>Em estoque</TableHead>
            <TableHead>Ações</TableHead>
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
          {data?.map(({ size, id, in_stock, price }) => (
            <TableRow key={id}>
              <TableCell>{size}ml</TableCell>
              <TableCell>{toBRL(+price)}</TableCell>
              <TableCell>{in_stock ? "sim" : "não"}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <EllipsisIcon />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() =>
                        setCupStates({ modalUpdate: true, idUpdate: id })
                      }
                    >
                      Editar <Edit />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() =>
                        setCupStates({
                          sizeDelete: size,
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
    </>
  );
}
