import React from 'react';

import { useSales } from '../hooks/use-sales';
import type { SaleItemProps } from '../types/sale.types';

export function SaleItem({ sale }: SaleItemProps) {
  return (
    <li className="bg-white p-4 mb-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Tenant ID: <span className="font-normal text-indigo-600">{sale.tenantId}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Composite Key: <span className="font-mono text-gray-700">{sale.compositeKey}</span>
          </p>
        </div>
      </div>
    </li>
  );
}

export function SalesList() {
  const { sales, salesCount, loading, error } = useSales();

  if (loading) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Carregando dados das vendas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Ocorreu um erro</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Lista de Vendas
          <span className="ml-3 bg-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
            {salesCount} Total
          </span>
        </h2>
      </header>
      
      {sales.length > 0 ? (
        <ul>
          {sales.map((sale) => (
            <SaleItem key={sale.compositeKey || sale.tenantId} sale={sale} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-8">Nenhuma venda encontrada.</p>
      )}
    </div>
  );
}
