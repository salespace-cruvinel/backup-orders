import React from 'react';
import { useStatusDashboard } from '../hooks/use-status-dashboard';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const SummaryCard = ({ title, count, value, entityName }) => (
  <div className="bg-blue-500 w-full bg-sky-500 shadow border text-center">
    <h3 className="font-bold text-lg text-gray-700 truncate" title={title}>{title}</h3>
    <p className="text-gray-600 mt-2">
      <span className="font-semibold">{count}</span> {entityName}
    </p>
    <p className="text-indigo-600 font-bold text-2xl mt-1">
      {formatCurrency(value)}
    </p>
  </div>
);

export function StatusDashboard() {
  const { data, loading, error } = useStatusDashboard();

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Carregando resumo do dashboard...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">Erro ao carregar dashboard: {error}</p>;
  }

  return (
    <div className="space-y-12">
      {/* Seção de Resumo de Vendas */}
      <div>
        <h2 className="text-2xl bg-sky-500 font-bold text-gray-800 mb-4">Resumo de Vendas por Status</h2>
        {data?.salesSummary && data.salesSummary.length > 0 ? (
          <div className="flex align-items-center justify-between">
            {data.salesSummary.map(item => (
              <SummaryCard
                key={`sale-${item.statusId}`}
                title={item.statusName}
                count={item.saleCount}
                value={item.totalValue}
                entityName={item.saleCount === 1 ? 'venda' : 'vendas'}
              />
            ))}
          </div>
        ) : <p>Nenhum dado de venda encontrado.</p>}
      </div>

      {/* Seção de Resumo de Pedidos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumo de Pedidos por Status</h2>
        {data?.ordersSummary && data.ordersSummary.length > 0 ? (
          <div className ="flex align-items-center justify-between">
            {data.ordersSummary.map(item => (
              <SummaryCard
                key={`order-${item.statusId}`}
                title={item.statusName}
                count={item.orderCount}
                value={item.totalValue}
                entityName={item.orderCount === 1 ? 'pedido' : 'pedidos'}
              />
            ))}
          </div>
        ) : <p>Nenhum dado de pedido encontrado.</p>}
      </div>
    </div>
  );
}
