import React from 'react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import type { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <h2 className="text-xl font-semibold p-6 border-b border-gray-700 text-gray-100">Recent Transactions</h2>
      <div className="divide-y divide-gray-700">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              {transaction.type === 'income' ? (
                <ArrowUpCircle className="w-6 h-6 text-green-500 mr-3" />
              ) : (
                <ArrowDownCircle className="w-6 h-6 text-red-500 mr-3" />
              )}
              <div>
                <p className="font-medium text-gray-100">{transaction.description}</p>
                <p className="text-sm text-gray-400">{transaction.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">
                {new Date(transaction.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No transactions yet
          </div>
        )}
      </div>
    </div>
  );
}