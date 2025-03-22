import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, LogOut, Download, CreditCard, Wallet, PieChart, ArrowUpRight, ArrowDownRight, Settings as SettingsIcon } from 'lucide-react';
import { Transaction, UserBudget, User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Calendar } from './Calendar';
import { Settings } from './Settings';
import { format } from 'date-fns';

interface BudgetProps {
  userId: string;
  onLogout: () => void;
}

const COLORS = ['#4CAF50', '#FF5252', '#9C27B0', '#2196F3'];

export function Budget({ userId, onLogout }: BudgetProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState('general');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactionDate, setTransactionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const { theme, toggleTheme } = useTheme();

  const categories = [
    { value: 'salary', label: 'Salary' },
    { value: 'investment', label: 'Investment' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const userBudget = budgets.find((b: UserBudget) => b.userId === userId);
    if (userBudget) {
      setTransactions(userBudget.transactions);
    }
  }, [userId]);

  const saveTransactions = (newTransactions: Transaction[]) => {
    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const budgetIndex = budgets.findIndex((b: UserBudget) => b.userId === userId);
    
    if (budgetIndex >= 0) {
      budgets[budgetIndex].transactions = newTransactions;
    } else {
      budgets.push({ userId, transactions: newTransactions });
    }
    
    localStorage.setItem('budgets', JSON.stringify(budgets));
    setTransactions(newTransactions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date(transactionDate).toISOString(),
      userId,
      category
    };
    
    const newTransactions = [...transactions, newTransaction];
    saveTransactions(newTransactions);
    
    setDescription('');
    setAmount('');
    setCategory('general');
    setTransactionDate(format(new Date(), 'yyyy-MM-dd'));
  };

  const handleUpdateUser = (updatedUser: User) => {
    const budgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const budgetIndex = budgets.findIndex((b: UserBudget) => b.userId === userId);
    
    if (budgetIndex >= 0) {
      budgets[budgetIndex].userId = updatedUser.username;
      localStorage.setItem('budgets', JSON.stringify(budgets));
    }
    
    setShowSettings(false);
  };

  const total = transactions.reduce((acc, curr) => {
    return acc + (curr.type === 'income' ? curr.amount : -curr.amount);
  }, 0);

  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.amount += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    } else {
      acc.push({ month, amount: transaction.type === 'income' ? transaction.amount : -transaction.amount });
    }
    
    return acc;
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryData = transactions.reduce((acc: any[], transaction) => {
    const existingCategory = acc.find(item => item.name === transaction.category);
    if (existingCategory) {
      existingCategory.value += transaction.amount;
    } else {
      acc.push({ name: transaction.category, value: transaction.amount });
    }
    return acc;
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Expense Report', 20, 20);
    
    const tableData = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type,
      `$${t.amount.toFixed(2)}`
    ]);

    (doc as any).autoTable({
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: tableData,
      startY: 30,
    });

    doc.save('expense-report.pdf');
  };

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const currentUser = users.find((u: User) => u.username === userId);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">My Dashboard</h1>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <SettingsIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {theme === 'light' ? <MinusCircle className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/80">Total Balance</p>
                  <h2 className="text-4xl font-bold">${total.toFixed(2)}</h2>
                </div>
                <div className="flex gap-4">
                  <button className="bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Transfer
                  </button>
                  <button onClick={downloadPDF} className="bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {showSettings ? (
              <Settings user={currentUser} onUpdateUser={handleUpdateUser} />
            ) : (
              <>
                {/* Add Transaction */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add Transaction</h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        className="rounded-xl border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        className="rounded-xl border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                        className="rounded-xl border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="rounded-xl border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        className="rounded-xl border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Add Transaction
                    </button>
                  </form>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Calendar Overview</h3>
                    <Calendar transactions={transactions} date={currentDate} />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Income vs Expenses</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={[
                              { name: 'Income', value: totalIncome },
                              { name: 'Expenses', value: totalExpense }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </RePieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Revenue Flow */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Revenue Flow</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Income</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      +${totalIncome.toFixed(2)}
                    </p>
                  </div>
                  <ArrowUpRight className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expenses</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      -${totalExpense.toFixed(2)}
                    </p>
                  </div>
                  <ArrowDownRight className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Transactions</h3>
              <div className="space-y-3">
                {transactions.slice(-5).reverse().map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-4 rounded-xl transition-transform hover:scale-102 ${
                      transaction.type === 'income'
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {categories.find(cat => cat.value === transaction.category)?.label || transaction.category}
                          </span>
                        </div>
                      </div>
                      <p className={`font-semibold ${
                        transaction.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}