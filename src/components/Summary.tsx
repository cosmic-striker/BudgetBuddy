import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { Transaction } from '../types';

interface SummaryProps {
  transactions: Transaction[];
}

export function Summary({ transactions }: SummaryProps) {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Balance</p>
            <p className="text-2xl font-semibold text-gray-100">${balance.toFixed(2)}</p>
          </div>
          <DollarSign className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Income</p>
            <p className="text-2xl font-semibold text-green-500">${income.toFixed(2)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Expenses</p>
            <p className="text-2xl font-semibold text-red-500">${expenses.toFixed(2)}</p>
          </div>
          <TrendingDown className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
}