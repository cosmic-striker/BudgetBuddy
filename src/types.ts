export interface User {
  username: string;
  password: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  userId: string;
  category: string;
}

export interface UserBudget {
  userId: string;
  transactions: Transaction[];
}