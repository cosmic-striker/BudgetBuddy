import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameMonth, isSameDay } from 'date-fns';
import { Transaction } from '../types';

interface CalendarProps {
  transactions: Transaction[];
  date: Date;
}

export function Calendar({ transactions, date }: CalendarProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayTransactions = (day: Date) => {
    return transactions.filter(t => isSameDay(new Date(t.date), day));
  };

  const getDayIndicatorColor = (day: Date) => {
    const dayTransactions = getDayTransactions(day);
    if (dayTransactions.length === 0) return null;

    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    if (income > 0 && expense === 0) return 'bg-green-500';
    if (income === 0 && expense > 0) return 'bg-red-500';
    if (expense > income) return 'bg-violet-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {format(date, 'MMMM yyyy')}
      </h3>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const indicatorColor = getDayIndicatorColor(day);
          return (
            <div
              key={day.toString()}
              className={`aspect-square p-2 flex flex-col items-center justify-center rounded-lg ${
                isSameMonth(day, date)
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-400 dark:text-gray-600'
              }`}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {indicatorColor && (
                <div className={`w-2 h-2 rounded-full mt-1 ${indicatorColor}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}