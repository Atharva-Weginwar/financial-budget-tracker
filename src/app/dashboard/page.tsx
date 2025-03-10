'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for demonstration
const mockData = {
  totalIncome: 5250.00,
  totalExpenses: 3720.50,
  balance: 1529.50,
  savingsGoal: 10000,
  currentSavings: 4500,
  recentTransactions: [
    { id: 1, description: 'Grocery Shopping', amount: -120.50, date: '2023-03-05', category: 'Food' },
    { id: 2, description: 'Salary', amount: 3500.00, date: '2023-03-01', category: 'Income' },
    { id: 3, description: 'Electric Bill', amount: -85.20, date: '2023-03-03', category: 'Utilities' },
    { id: 4, description: 'Freelance Work', amount: 750.00, date: '2023-03-02', category: 'Income' },
    { id: 5, description: 'Restaurant', amount: -65.30, date: '2023-03-04', category: 'Food' },
  ],
  budgetCategories: [
    { name: 'Housing', allocated: 1200, spent: 1200, remaining: 0 },
    { name: 'Food', allocated: 600, spent: 450, remaining: 150 },
    { name: 'Transportation', allocated: 400, spent: 320, remaining: 80 },
    { name: 'Utilities', allocated: 300, spent: 250, remaining: 50 },
    { name: 'Entertainment', allocated: 200, spent: 180, remaining: 20 },
  ],
};

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'week'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'month'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'year'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${mockData.totalIncome.toFixed(2)}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/transactions?type=income" className="font-medium text-primary-600 hover:text-primary-500">
                View all income
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${mockData.totalExpenses.toFixed(2)}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/transactions?type=expense" className="font-medium text-primary-600 hover:text-primary-500">
                View all expenses
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Current Balance</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${mockData.balance.toFixed(2)}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/dashboard/reports" className="font-medium text-primary-600 hover:text-primary-500">
                View detailed report
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Budget Overview</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your current month's budget progress.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {mockData.budgetCategories.map((category) => (
              <div key={category.name}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-medium text-gray-700">{category.name}</div>
                  <div className="text-sm text-gray-500">
                    ${category.spent.toFixed(2)} / ${category.allocated.toFixed(2)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      category.spent > category.allocated
                        ? 'bg-red-600'
                        : category.spent / category.allocated > 0.8
                        ? 'bg-yellow-400'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, (category.spent / category.allocated) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/budget"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Manage Budget
            </Link>
          </div>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Savings Goal</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Track your progress towards your savings goal.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium text-gray-700">Emergency Fund</div>
            <div className="text-sm text-gray-500">
              ${mockData.currentSavings.toFixed(2)} / ${mockData.savingsGoal.toFixed(2)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="h-4 rounded-full bg-secondary-500"
              style={{ width: `${(mockData.currentSavings / mockData.savingsGoal) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500">
            {((mockData.currentSavings / mockData.savingsGoal) * 100).toFixed(0)}% complete
          </div>
          <div className="mt-6">
            <Link
              href="/dashboard/goals"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              View All Goals
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your latest financial activities.</p>
          </div>
          <Link
            href="/dashboard/transactions"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.date}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 