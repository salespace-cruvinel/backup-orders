/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useStatusDashboard } from '../hooks/use-status-dashboard';
import { ShoppingCart, Package, CheckCircle, XCircle, Clock } from 'lucide-react';

const formatCurrency = (value: number) => {
  if (typeof value !== 'number') return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const statusKeys = ['aprovado', 'reprovado', 'pendente', 'default'] as const;
type StatusKey = typeof statusKeys[number];

const statusVisuals: Record<StatusKey, { icon: React.FC<any>; color: string }> = {
  aprovado: { icon: CheckCircle, color: 'text-green-500' },
  reprovado: { icon: XCircle, color: 'text-red-500' },
  pendente: { icon: Clock, color: 'text-orange-500' },
  default: { icon: Package, color: 'text-gray-500' }
};

const getStatusVisuals = (statusName: string) => {
  const normalizedStatus = statusName.toLowerCase();
  for (const key of statusKeys) {
    if (normalizedStatus.includes(key)) {
      return statusVisuals[key];
    }
  }
  return statusVisuals.default;
};


type SummaryCardProps = {
  title: string;
  count: number | undefined;
  value: number;
  entityName: string;
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, count, value, entityName }) => {
  const { icon: Icon, color } = getStatusVisuals(title);

  return (
    <div className='flex flex-col bg-white p-6 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300'>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-700 capitalize truncate" title={title}>{title}</h3>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className='text-3xl font-bold text-gray-800 mb-1'>
        {formatCurrency(value)}
      </p>
      <p className='text-sm text-gray-500'>
        <span className='font-semibold'>{count ?? 0}</span> {entityName}
      </p>
    </div>
  );
};


const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
);


export function StatusDashboard() {
  const { data, loading, error } = useStatusDashboard();

  if (loading) {
    return (
      <div className="mt-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4'>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mt-6" role="alert">
        <p className="font-bold">Ocorreu um erro ao carregar o dashboard</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 mt-6">
      <div>
        <h2 className='font-semibold text-2xl text-gray-800 mb-4 flex items-center gap-3'>
          <ShoppingCart className="text-blue-600"/>
          Resumo de Vendas por Status
        </h2>
        {data?.salesSummary && data.salesSummary.length > 0 ? (
          <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5'>
            {data.salesSummary.map(item => (
              <SummaryCard
                key={`sale-${item.statusId}`}
                title={item.statusName}
                count={item?.saleCount}
                value={item?.totalValue}
                entityName={item.saleCount === 1 ? 'venda' : 'vendas'}
              />
            ))}
          </div>
        ) : <p className="text-gray-500">Nenhum dado de venda encontrado.</p>}
      </div>

      <div>
        <h2 className='font-semibold text-2xl text-gray-800 mb-4 flex items-center gap-3'>
            <Package className="text-purple-600"/>
            Resumo de Pedidos por Status
        </h2>
        {data?.ordersSummary && data.ordersSummary.length > 0 ? (
          <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5'>
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
        ) : <p className="text-gray-500">Nenhum dado de pedido encontrado.</p>}
      </div>
    </div>
  );
}
