import React, { useState } from 'react';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Summary } from './components/Summary';
import type { Transaction } from './types';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [transaction, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">BudgetBuddy</h1>
        
        <Summary transactions={transactions} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TransactionForm onAddTransaction={handleAddTransaction} />
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default App