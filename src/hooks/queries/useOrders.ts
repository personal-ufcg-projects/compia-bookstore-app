// src/hooks/queries/useOrders.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type CreateOrderPayload, type OrderStatus } from "@/lib/api";
import { toast } from "sonner";

export const orderKeys = {
  all: ["orders"] as const,
  list: (params?: { status?: OrderStatus; page?: number }) =>
    [...orderKeys.all, "list", params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

// ─── Hooks de leitura ────────────────────────────────────────────────────────

export function useOrders(params?: { status?: OrderStatus; page?: number; limit?: number }) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.list(params),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.get(id),
    enabled: !!id,
  });
}

// ─── Hooks de mutação ────────────────────────────────────────────────────────

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderPayload) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Pedido realizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao finalizar pedido: ${error.message}`);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.setQueryData(orderKeys.detail(updated.id), updated);
      toast.success("Status atualizado!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    },
  });
}
