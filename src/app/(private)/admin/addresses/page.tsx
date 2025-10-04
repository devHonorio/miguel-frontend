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
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  EllipsisIcon,
  Loader2,
  PlusCircle,
  Search,
  Trash2,
} from "lucide-react";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useDelete, useGet } from "./hooks/query";
import { FormCreate } from "./components/form-create";
import { FormUpdate } from "./components/form-update";
import Link from "next/link";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useStates } from "./hooks/query/useStates";
import { Input } from "@/components/ui/input";
import { sleep500ms } from "@/app/utils/sleep500ms";

export default function Cups() {
  const { mutate, isPending: isPendingDelete } = useDelete();

  const {
    idDelete,
    idUpdate,
    modalAlertDelete,
    modalCreate,
    modalUpdate,
    page,
    query,
    setAddressStates,
    take,
  } = useStates();
  const { data, isPending } = useGet(take, page, query);

  return (
    <>
      <Dialog
        open={modalCreate}
        onOpenChange={(open) => setAddressStates({ modalCreate: open })}
      >
        <DialogTrigger asChild>
          <Button className="self-start">
            Adicionar endereço <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar endereço</DialogTitle>
            <DialogDescription>
              Formulário para criar um endereço
            </DialogDescription>
          </DialogHeader>
          <FormCreate />
        </DialogContent>
      </Dialog>

      <Dialog
        open={modalUpdate}
        onOpenChange={(open) =>
          setAddressStates({ modalUpdate: open, idUpdate: "" })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar endereço </DialogTitle>
            <DialogDescription>
              Formulário para editar endereço
            </DialogDescription>
          </DialogHeader>

          <FormUpdate id={idUpdate} />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={modalAlertDelete}
        onOpenChange={(open) =>
          setAddressStates({ modalAlertDelete: open, idDelete: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja apagar?</AlertDialogTitle>
            <AlertDialogDescription>
              Se você apagar esse endereço, ele também será apagado dos pedidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                mutate(idDelete);
                setAddressStates({ modalAlertDelete: true });
              }}
              disabled={isPending}
            >
              Apagar mesmo assim
              {isPendingDelete && <Loader2 className="animate-spin" />}
            </Button>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex gap-2">
        <Input
          placeholder="Buscar"
          onChange={(e) =>
            sleep500ms(() => setAddressStates({ query: e.target.value }))
          }
        />
        <Button size="icon">
          <Search />
        </Button>
      </div>

      {!isPending && (
        <Table>
          <TableCaption>Endereços cadastrados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Endereço</TableHead>
              <TableHead>Preço/R$</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending && (
              <TableRow>
                <TableCell align="center" colSpan={3} className="py-5">
                  <Loader2 className="animate-spin" />
                </TableCell>
              </TableRow>
            )}
            {data?.map(({ address, id, shipping_price }) => (
              <TableRow key={id}>
                <TableCell className="whitespace-break-spaces uppercase">
                  {address}
                </TableCell>
                <TableCell>{toCentsInBRL(shipping_price)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <EllipsisIcon />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <Link
                        href={`/admin/addresses?modalUpdate=true&idUpdate=${id}`}
                      >
                        <DropdownMenuItem>
                          Editar <Edit />
                        </DropdownMenuItem>
                      </Link>

                      <Link href={`?idDelete=${id}&modalAlertDelete=true`}>
                        <DropdownMenuItem variant="destructive">
                          Apagar <Trash2 />
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {isPending && <Loader2 className="animate-spin" />}

      <Pagination>
        <PaginationContent>
          {page > 0 && (
            <PaginationItem
              onClick={() => setAddressStates({ page: page - 1 })}
            >
              <PaginationLink isActive>
                <ChevronLeft className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationLink>
            <PaginationItem>{page + 1}</PaginationItem>
          </PaginationLink>

          {data.length === take && (
            <PaginationItem>
              <PaginationLink
                isActive
                onClick={() => setAddressStates({ page: page + 1 })}
              >
                <ChevronRight className="h-4 w-4" />
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </>
  );
}
