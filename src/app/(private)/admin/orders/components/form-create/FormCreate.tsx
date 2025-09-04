import User from "@/entities/User";

import { Combobox } from "@/components/combobox";
import { useFormCreate } from "../../hooks/form";
import { CupsForm } from "./form-cups";
import { Textarea } from "@/components/ui/textarea";
import { SwitchWithDescription } from "@/components/switch-with-description";
import { Input } from "@/components/ui/input";
import { useSearchAddresses, useSearchUsers } from "../../hooks/query";
import { useUrlState } from "../../hooks/useUrlState";
import { toCentsInBRL } from "@/app/utils/toCentInBRL";
import { cleanFormatBRLAndParseCents } from "@/app/utils/cleanFormatBRLAndParseCents";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { CreateOrderType } from "../../schema";
import { api } from "@/app/(public)/services";
import { AxiosError } from "axios";
import { ListOrders } from "../../page";
import { queryClient } from "@/providers/react-query";
import { Select } from "@/components/select";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { sleep500ms } from "@/app/utils/sleep500ms";

export const FormCreate = () => {
  const [orderStates, setOrderStates] = useQueryStates({
    modalCreate: parseAsBoolean.withDefault(false),

    search: parseAsString.withDefault(""),
    take: parseAsInteger.withDefault(0),
    skip: parseAsInteger.withDefault(0),

    queryClient: parseAsString.withDefault(""),
    queryAddress: parseAsString.withDefault(""),
  });
  const { order, setOrder } = useUrlState();

  const { control, handleSubmit, errors } = useFormCreate({
    ...order,
    totalPrice: order.total,
    discount: order.discount,
  });

  const { data, isLoading } = useSearchUsers(orderStates.queryClient);
  const { data: addresses, isLoading: isLoadingAddresses } = useSearchAddresses(
    orderStates.queryAddress,
  );

  const { mutate: createOrder, isPending: isPendingCreateOrder } = useMutation({
    mutationFn: async (data: CreateOrderType) => {
      const response = await api.post("/orders", data);

      return response.data as ListOrders;
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
        [data, ...orders].sort((a) => {
          if (a.status === "confirmar_pedido") return -1;

          return 0;
        }),
      );
      setOrderStates({ modalCreate: false });
      toast.success("Salvo com sucesso!");
    },
  });

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={handleSubmit((data) => createOrder(data))}
    >
      <Combobox
        data={
          data?.map(({ name, phone, id }) => ({
            label: name,
            value: id,
            complement: User.phoneMask(phone.slice(2)),
          })) ?? []
        }
        label={order.clientLabel}
        onChange={(query) =>
          sleep500ms(() => setOrderStates({ queryClient: query }))
        }
        shouldFilter={false}
        isLoading={isLoading}
        value={order.clientId}
        onSelect={(value, label) => {
          setOrder({ clientId: value, clientLabel: label });
        }}
        errorMessage={errors.clientId?.message}
      />

      <CupsForm control={control} />

      <Textarea
        placeholder="Observações"
        onChange={(e) => setOrder({ observations: e.target.value })}
        value={order.observations}
      />

      <SwitchWithDescription
        title="Entrega"
        onCheckedChange={(value) => {
          if (!value)
            return setOrder({
              isDelivery: value,
              addressLabel: "Endereço",
              addressId: "",
              shippingPrice: 0,
            });
          setOrder({ isDelivery: value });
        }}
        checked={order.isDelivery}
      />

      {order.isDelivery && (
        <>
          <Combobox
            data={
              addresses?.map(({ id, address_complete }) => ({
                label: address_complete.toUpperCase(),
                value: id,
              })) ?? []
            }
            label={order.addressLabel}
            value={order.addressId}
            onChange={(value) =>
              sleep500ms(() => setOrderStates({ queryAddress: value }))
            }
            onSelect={(value, label) => {
              const address = addresses?.find(({ id }) => id === value);

              if (!address) return console.error("Endereço não encontrado");
              setOrder({
                addressId: value,
                addressLabel: label,
                shippingPrice: address.shipping_price * 100,
              });
            }}
            isLoading={isLoadingAddresses}
            errorMessage={errors.addressId?.message}
          />

          <Input
            label="Frete"
            onChange={(e) => {
              setOrder({
                shippingPrice: cleanFormatBRLAndParseCents(e.target.value),
              });
            }}
            onClick={(e) => e.currentTarget.select()}
            placeholder="R$ 00,00"
            value={toCentsInBRL(order.shippingPrice)}
            error={errors.shippingPrice?.message}
          />
        </>
      )}

      <Input
        label="Desconto/R$"
        onChange={(e) => {
          setOrder({ discount: cleanFormatBRLAndParseCents(e.target.value) });
        }}
        onClick={(e) => e.currentTarget.select()}
        placeholder="R$ 00,00"
        value={toCentsInBRL(order.discount)}
      />

      {errors.discount?.message && (
        <p className="text-sm text-red-500">{errors.discount?.message}</p>
      )}

      <div>
        <p
          className="font-black data-[error=true]:text-red-500"
          data-error={!!errors.totalPrice?.message}
        >
          Total {toCentsInBRL(order.total)}
        </p>
        {errors.totalPrice?.message && (
          <p className="text-sm text-red-500">{errors.totalPrice?.message}</p>
        )}
      </div>

      <Select
        label={order.status}
        data={[
          { value: "rascunho", label: "Rascunho" },
          { value: "confirmar_pedido", label: "Confirmar" },
          { value: "anotado", label: "Anotado" },
          { value: "cancelado", label: "Cancelado" },
        ]}
        onSelect={(val) =>
          setOrder({ status: val as CreateOrderType["status"] })
        }
      />
      <Button isLoading={isPendingCreateOrder}>Salvar</Button>
    </form>
  );
};
