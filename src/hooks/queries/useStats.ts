// src/hooks/queries/useStats.ts

import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api";

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: statsApi.get,
    // Atualiza a cada 30 segundos automaticamente
    refetchInterval: 30_000,
  });
}
