import { useEffect, useState } from "react";

// Tipagem para os resumos que virão da API
interface StatusSummaryItem {
  statusId: number;
  statusName: string;
  saleCount?: number; // Para o resumo de vendas
  orderCount?: number; // Para o resumo de pedidos
  totalValue: number;
}

interface DashboardData {
  salesSummary: StatusSummaryItem[];
  ordersSummary: StatusSummaryItem[];
}

export function useStatusDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3001/api/dashboard/status-summary"
        );
        if (!response.ok) {
          throw new Error("Falha ao buscar dados do dashboard.");
        }
        const result: DashboardData = await response.json();
        setData(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
}
