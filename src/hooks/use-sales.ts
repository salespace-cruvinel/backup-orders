import { useEffect, useState } from "react";
import type { Sale } from "../types/sale.types";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesCount, setSalesCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Hook: Iniciando busca de vendas...");

    const fetchSalesFromApi = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/sales"); // request para a rota que monta as sales

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
        }

        const result = await response.json();

        console.log("Hook: Vendas recebidas da API:", result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedData = (result.data ?? []).map((item: any) => ({
          tenantId: item.tenantId ?? "ID não encontrado",
          compositeKey: item.compositeKey ?? "Chave não encontrada",
          ...item,
        }));

        setSales(formattedData);
        setSalesCount(formattedData.length ?? 0);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Hook: Falha ao buscar vendas:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesFromApi();
  }, []);

  return { sales, salesCount, loading, error };
}
