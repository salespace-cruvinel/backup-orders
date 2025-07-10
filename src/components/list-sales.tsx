import React, { useState, useMemo } from 'react';
import { useSales } from '../hooks/use-sales';
import { ArrowUp, ArrowDown, ClipboardCopy, Check } from 'lucide-react';
import type { Sale } from '../types/sale.types';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  });
};

type SortConfig = {
  key: keyof Sale;
  direction: 'ascending' | 'descending';
} | null;

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => console.error('Falha ao copiar texto: ', err));
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
      title={isCopied ? "Copiado!" : "Copiar"}
    >
      {isCopied ? <Check size={14} className="text-green-500" /> : <ClipboardCopy size={14} />}
    </button>
  );
};

const TableSkeleton = () => {
    const SkeletonRow = () => (
        <tr className="bg-white border-b">
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10/12"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10/12"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10/12"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10/12"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-10/12"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
        </tr>
    );

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-8 animate-pulse">
            <header className="mb-4">
                <div className="h-7 bg-gray-300 rounded w-1/3"></div>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="text-xs text-transparent uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-1/2"></div></th>
                            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-1/2"></div></th>
                            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-1/2"></div></th>
                            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-1/2"></div></th>
                            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-1/2"></div></th>
                            <th className="px-6 py-3"><div className="h-4 bg-gray-300 rounded w-1/2"></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export function SalesList() {
  const { sales, salesCount, loading, error } = useSales();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' });

  const sortedSales = useMemo(() => {
    if (!sales) return [];
    const sortableSales = [...sales];
    if (sortConfig !== null) {
      sortableSales.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return sortableSales;
  }, [sales, sortConfig]);

  const requestSort = (key: keyof Sale) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ columnKey, title }: { columnKey: keyof Sale, title: string }) => {
    const isSorted = sortConfig?.key === columnKey;
    const directionIcon = sortConfig?.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    return (
      <th scope="col" className="px-6 py-3">
        <button onClick={() => requestSort(columnKey)} className="flex items-center gap-2 uppercase p-2 -m-2 rounded-md hover:bg-gray-200 transition-colors">
          {title}
          {isSorted && directionIcon}
        </button>
      </th>
    );
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Ocorreu um erro</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-8">
      <header className="mb-4">
        <h2 className='font-semibold text-xl text-gray-800'>
          Lista de Vendas 
          <span className='text-gray-500 font-normal text-lg'>({salesCount})</span>
        </h2>
      </header>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 bg-gray-50">
            <tr>
              <SortableHeader columnKey="brandId" title="Brand ID" />
              <SortableHeader columnKey="customerId" title="Customer ID" />
              <SortableHeader columnKey="userId" title="User ID" />
              <SortableHeader columnKey="createdAt" title="Criado Em" />
              <SortableHeader columnKey="updatedAt" title="Atualizado Em" />
              <th scope="col" className="px-6 py-3 uppercase">Chave de Idempotência</th>
            </tr>
          </thead>
          
          <tbody>
            {sortedSales.length > 0 ? (
              sortedSales.map((sale: Sale) => (
                <tr key={sale.compositeKey} className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 font-medium text-gray-900">{sale.brandId}</td>
                  <td className="px-6 py-4">{sale.customerId}</td>
                  <td className="px-6 py-4">{sale.userId}</td>
                  <td className="px-6 py-4">{formatDate(sale.createdAt)}</td>
                  <td className="px-6 py-4">{formatDate(sale.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-gray-500 truncate" title={sale.idempotencyKey}>
                        {sale.idempotencyKey}
                      </span>
                      <CopyButton textToCopy={sale.idempotencyKey} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Nenhuma venda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
