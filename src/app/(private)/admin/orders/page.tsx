"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  CirclePlus,
  Loader2,
  MoreHorizontal,
  Printer,
  Search,
  SquarePen,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { FormCreate } from "./components/form-create";
import { useMutation, useQuery } from "@tanstack/react-query";

import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import { Badge } from "@/components/ui/badge";

import { useApi } from "@/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateOrderType } from "./schema";
import { Input } from "@/components/ui/input";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { queryClient } from "@/providers/react-query";
import { sleep500ms } from "@/app/utils/sleep500ms";
import { FormEdit } from "./components/form-edit";
import { useRouter } from "next/navigation";
import { useUrlState } from "./hooks/useUrlState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ListOrders {
  id: string;
  user: string;
  address_id: string | null;
  total_price: number;
  status: CreateOrderType["status"];
  created_at: string;
}

const StatusComponents = {
  rascunho: <Badge className="bg-amber-200 text-black">Rascunho</Badge>,
  confirmar_pedido: <Badge className="bg-cyan-300 text-black">Confirmar</Badge>,
  anotado: <Badge className="bg-secondary text-black">Anotado</Badge>,
  cancelado: <Badge className="bg-red-500">Cancelado</Badge>,
};

export interface ResponseOrder {
  address_id: string;
  address_label: string;
  client_id: string;
  client_label: string;
  phone: string;
  discount: number;
  is_delivery: boolean;
  observations: string;
  shipping_price: number;
  status: CreateOrderType["status"];
  total_price: number;
  cups: {
    additional: { id: string; price: number; label: string }[];
    id: string;
    label: string;
    price: number;
    cup_id: string;
    quantity_additional: number;
    total_price: number;
  }[];
}

export default function Orders() {
  const { clearAll } = useUrlState();
  const [orderStates, setOrderStates] = useQueryStates({
    modalCreate: parseAsBoolean.withDefault(false),
    modalAlertDelete: parseAsBoolean.withDefault(false),

    idDelete: parseAsString.withDefault(""),
    orderId: parseAsString.withDefault(""),

    search: parseAsString.withDefault(""),
    take: parseAsInteger.withDefault(0),
    skip: parseAsInteger.withDefault(0),

    modalEdit: parseAsBoolean.withDefault(false),
  });
  const { api } = useApi();

  const { data, isLoading, isFetching } = useQuery<ListOrders[]>({
    queryKey: [
      "orders",
      orderStates.search,
      orderStates.skip,
      orderStates.take,
    ],
    initialData: [],
    queryFn: async () => {
      const response = await api.get(
        `/orders?search=${orderStates.search}&take=${orderStates.take}&skip=${orderStates.skip}`,
      );

      return response.data;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/orders/${id}`);

      return response.data as { id: string };
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        return toast.error(err.response?.data.message);
      }

      toast.error("Erro no servidor");
      console.error(err);
    },
    onSuccess: (data) => {
      const orders = queryClient.getQueryData([
        "orders",
        orderStates.search,
        orderStates.skip,
        orderStates.take,
      ]) as ListOrders[];

      queryClient.setQueriesData(
        {
          queryKey: [
            "orders",
            orderStates.search,
            orderStates.skip,
            orderStates.take,
          ],
        },
        orders.filter(({ id }) => id !== data.id),
      );
      setOrderStates({ modalAlertDelete: false });
      toast.success("Salvo com sucesso!");
    },
  });

  const { push } = useRouter();
  const { mutate: mutateOrder, isPending: isPendingOrder } = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.get(`/orders/${orderId}`);

      return response.data as ResponseOrder;
    },

    onSuccess(orderData, orderId) {
      push(
        `?addressId=${orderData.address_id}&addressLabel=${orderData.address_label}&clientId=${orderData.client_id}&clientLabel=${orderData.client_label}&discount=${orderData.discount}&isDelivery=${orderData.is_delivery}&observations=${orderData.observations}&shippingPrice=${orderData.shipping_price}&status=${orderData.status}&cups=${JSON.stringify(
          orderData.cups.map(
            ({
              id,
              additional,
              label,
              price,
              quantity_additional,
              total_price,
            }) => {
              return {
                id,
                additional,
                label,
                price: total_price,
                quantityAdditional: quantity_additional,
                priceCup: price,
              };
            },
          ),
        )}&total=${orderData.total_price}&modalEdit=true&orderId=${orderId}`,
      );
    },
  });

  return (
    <>
      {isPendingOrder && (
        <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center bg-black/60">
          <Card>
            <CardContent>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Carregando pedido...
                </CardTitle>
              </CardHeader>
            </CardContent>
          </Card>
        </div>
      )}
      <AlertDialog
        open={orderStates.modalAlertDelete}
        onOpenChange={(open) => setOrderStates({ modalAlertDelete: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja apagar?</AlertDialogTitle>
            <AlertDialogDescription>
              Se você apagar esse pedido, ele também será apagado
              definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button
              onClick={() => {
                mutate(orderStates.idDelete);
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

      <Link href={"?modalCreate=true"}>
        <Button>
          Adicionar pedido <CirclePlus />
        </Button>
      </Link>

      <div className="flex gap-2">
        <Input
          placeholder="Cliente"
          onChange={(e) => {
            sleep500ms(() => {
              setOrderStates({ search: e.target.value, take: 5, skip: 0 });
            });
          }}
        />

        <Button size="icon">
          <Search />
        </Button>
      </div>
      <Dialog
        open={orderStates.modalCreate}
        onOpenChange={(open) => {
          setOrderStates({ modalCreate: open });
          if (!open) clearAll();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pedido</DialogTitle>
          </DialogHeader>
          <DialogDescription>Criar pedido</DialogDescription>
          <FormCreate />
        </DialogContent>
      </Dialog>

      <Dialog
        open={orderStates.modalEdit}
        onOpenChange={(open) => {
          setOrderStates({ modalEdit: open });
          if (!open) {
            clearAll();
            setOrderStates(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pedido</DialogTitle>
          </DialogHeader>
          <DialogDescription>Editar pedido</DialogDescription>
          <FormEdit />
        </DialogContent>
      </Dialog>

      {!data.length && !isLoading && !isFetching && (
        <div className="mx-auto font-bold text-black/50">
          Nenhum pedido encontrado
        </div>
      )}
      {!isLoading && (
        <div>
          {data.map(
            ({ id, address_id, total_price, user, status, created_at }) => (
              <div
                key={id}
                className="flex items-center justify-between gap-2 p-2 even:bg-gray-50"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-bold text-black/50">
                    {new Date(created_at).toLocaleDateString()}
                  </div>
                  <div className="text-sm">{user}</div>
                  <div className="text-xs font-bold">
                    {toCentsInBRL(total_price)}
                  </div>
                  <div className="text-black/60">
                    {address_id ? "Entrega" : "Retirada"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {StatusComponents[status]}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="secondary">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <Link href={`/admin/orders/print/${id}`}>
                        <DropdownMenuItem>
                          Imprimir <Printer className="h-4 w-4" />
                        </DropdownMenuItem>
                      </Link>

                      <Link href={`?modalEdit=true&orderId=${id}`}>
                        <DropdownMenuItem onClick={() => mutateOrder(id)}>
                          Editar <SquarePen className="h-4 w-4" />
                        </DropdownMenuItem>
                      </Link>

                      <Link
                        href={`?idDelete=${id}&search=${orderStates.search}&take=${orderStates.take}&skip=${orderStates.skip}&modalAlertDelete=true`}
                      >
                        <DropdownMenuItem variant="destructive">
                          Deletar <Trash2 className="h-4 w-4" />
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ),
          )}
          {orderStates.search && !!data.length && (
            <Pagination>
              <PaginationContent className="my-5">
                {!!orderStates.skip && (
                  <>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setOrderStates((prev) => ({ skip: prev.skip - 1 }))
                        }
                      />
                    </PaginationItem>

                    <PaginationItem
                      onClick={() =>
                        setOrderStates(({ skip }) => ({ skip: skip - 1 }))
                      }
                    >
                      <PaginationLink>{orderStates.skip}</PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationLink isActive>
                    {orderStates.skip + 1}
                  </PaginationLink>
                </PaginationItem>

                {data.length == orderStates.take && (
                  <>
                    <PaginationItem
                      onClick={() =>
                        setOrderStates(({ skip }) => ({ skip: skip + 1 }))
                      }
                    >
                      <PaginationLink>{orderStates.skip + 2}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setOrderStates(({ skip }) => ({ skip: skip + 1 }))
                        }
                      />
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
      {(isFetching || isLoading) && <Loader2 className="animate-spin" />}
    </>
  );
}
