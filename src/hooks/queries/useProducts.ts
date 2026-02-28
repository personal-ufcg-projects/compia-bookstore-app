// src/hooks/queries/useProducts.ts
// Substitui o import direto de @/data/products por chamadas reais à API.
// Use esses hooks em qualquer componente que precise de produtos.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, type ProductFilters, type Product } from "@/lib/api";
import { toast } from "sonner";

// Chaves de cache centralizadas
export const productKeys = {
  all: ["products"] as const,
  list: (filters?: ProductFilters) => [...productKeys.all, "list", filters] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

// ─── Hooks de leitura ────────────────────────────────────────────────────────

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.list(filters),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.get(id),
    enabled: !!id,
  });
}

// ─── Hooks de mutação (admin) ────────────────────────────────────────────────

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
      productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Produto criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar produto: ${error.message}`);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>;
    }) => productsApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.setQueryData(productKeys.detail(updated.id), updated);
      toast.success("Produto atualizado!");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Produto removido.");
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });
}
