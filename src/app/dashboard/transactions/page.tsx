'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';

// Mock data for demonstration
const mockCategories = [
  { id: '1', name: 'Salary', type: 'INCOME', color: '#34D399' },
  { id: '2', name: 'Freelance', type: 'INCOME', color: '#60A5FA' },
  { id: '3', name: 'Housing', type: 'EXPENSE', color: '#F87171' },
  { id: '4', name: 'Food', type: 'EXPENSE', color: '#FBBF24' },
  { id: '5', name: 'Transportation', type: 'EXPENSE', color: '#A78BFA' },
  { id: '6', name: 'Utilities', type: 'EXPENSE', color: '#6EE7B7' },
  { id: '7', name: 'Entertainment', type: 'EXPENSE', color: '#F472B6' },
];

const mockTransactions = [
  { 
    id: '1', 
    description: 'Monthly Salary', 
    amount: 3500.00, 
    date: '2023-03-01', 
    categoryId: '1',
    category: { id: '1', name: 'Salary', type: 'INCOME', color: '#34D399' }
  },
  { 
    id: '2', 
    description: 'Freelance Project', 
    amount: 750.00, 
    date: '2023-03-02', 
    categoryId: '2',
    category: { id: '2', name: 'Freelance', type: 'INCOME', color: '#60A5FA' }
  },
  { 
    id: '3', 
    description: 'Rent Payment', 
    amount: -1200.00, 
    date: '2023-03-03', 
    categoryId: '3',
    category: { id: '3', name: 'Housing', type: 'EXPENSE', color: '#F87171' }
  },
  { 
    id: '4', 
    description: 'Grocery Shopping', 
    amount: -120.50, 
    date: '2023-03-05', 
    categoryId: '4',
    category: { id: '4', name: 'Food', type: 'EXPENSE', color: '#FBBF24' }
  },
  { 
    id: '5', 
    description: 'Electric Bill', 
    amount: -85.20, 
    date: '2023-03-03', 
    categoryId: '6',
    category: { id: '6', name: 'Utilities', type: 'EXPENSE', color: '#6EE7B7' }
  },
  { 
    id: '6', 
    description: 'Gas Station', 
    amount: -45.00, 
    date: '2023-03-04', 
    categoryId: '5',
    category: { id: '5', name: 'Transportation', type: 'EXPENSE', color: '#A78BFA' }
  },
  { 
    id: '7', 
    description: 'Movie Tickets', 
    amount: -30.00, 
    date: '2023-03-06', 
    categoryId: '7',
    category: { id: '7', name: 'Entertainment', type: 'EXPENSE', color: '#F472B6' }
  },
  { 
    id: '8', 
    description: 'Restaurant Dinner', 
    amount: -65.30, 
    date: '2023-03-04', 
    categoryId: '4',
    category: { id: '4', name: 'Food', type: 'EXPENSE', color: '#FBBF24' }
  },
];

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);
  const [categories, setCategories] = useState(mockCategories);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: typeParam || 'all',
    category: 'all',
    startDate: '',
    endDate: '',
    searchTerm: '',
  });

  // Handle adding a new transaction
  const handleAddTransaction = (newTransaction: any) => {
    // Add the new transaction to the transactions state
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  // Apply filters when they change
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(transaction => {
        if (filters.type === 'income') {
          return transaction.amount > 0;
        } else if (filters.type === 'expense') {
          return transaction.amount < 0;
        }
        return true;
      });
    }
    
    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(transaction => transaction.categoryId === filters.category);
    }
    
    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(filters.endDate));
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.description.toLowerCase().includes(term) || 
        transaction.category.name.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredTransactions(filtered);
  }, [filters, transactions]);

  // Initialize filters from URL params
  useEffect(() => {
    if (typeParam) {
      setFilters(prev => ({ ...prev, type: typeParam }));
    }
  }, [typeParam]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Add Transaction
        </button>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddTransaction={handleAddTransaction}
      />

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search transactions..."
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Transactions ({filteredTransactions.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {filteredTransactions.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
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
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${transaction.category.color}20`, 
                          color: transaction.category.color 
                        }}
                      >
                        {transaction.category.name}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No transactions found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 