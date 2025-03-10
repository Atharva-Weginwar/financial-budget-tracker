'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for demonstration
const mockCategories = [
  { id: '3', name: 'Housing', type: 'EXPENSE', color: '#F87171' },
  { id: '4', name: 'Food', type: 'EXPENSE', color: '#FBBF24' },
  { id: '5', name: 'Transportation', type: 'EXPENSE', color: '#A78BFA' },
  { id: '6', name: 'Utilities', type: 'EXPENSE', color: '#6EE7B7' },
  { id: '7', name: 'Entertainment', type: 'EXPENSE', color: '#F472B6' },
  { id: '8', name: 'Healthcare', type: 'EXPENSE', color: '#38BDF8' },
  { id: '9', name: 'Personal', type: 'EXPENSE', color: '#FB923C' },
  { id: '10', name: 'Education', type: 'EXPENSE', color: '#4ADE80' },
];

const mockBudget = {
  id: '1',
  name: 'March 2023 Budget',
  startDate: '2023-03-01',
  endDate: '2023-03-31',
  items: [
    { id: '1', categoryId: '3', category: { id: '3', name: 'Housing', color: '#F87171' }, amount: 1200, spent: 1200 },
    { id: '2', categoryId: '4', category: { id: '4', name: 'Food', color: '#FBBF24' }, amount: 600, spent: 450 },
    { id: '3', categoryId: '5', category: { id: '5', name: 'Transportation', color: '#A78BFA' }, amount: 400, spent: 320 },
    { id: '4', categoryId: '6', category: { id: '6', name: 'Utilities', color: '#6EE7B7' }, amount: 300, spent: 250 },
    { id: '5', categoryId: '7', category: { id: '7', name: 'Entertainment', color: '#F472B6' }, amount: 200, spent: 180 },
  ],
};

export default function BudgetPage() {
  const [budget, setBudget] = useState(mockBudget);
  const [categories, setCategories] = useState(mockCategories);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const totalBudgeted = budget.items.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = budget.items.reduce((sum, item) => sum + item.spent, 0);
  const remainingBudget = totalBudgeted - totalSpent;

  const handleAddCategory = () => {
    if (!newCategory || !newAmount) return;

    const selectedCategory = categories.find(cat => cat.id === newCategory);
    if (!selectedCategory) return;

    const newItem = {
      id: `item-${Date.now()}`,
      categoryId: selectedCategory.id,
      category: selectedCategory,
      amount: parseFloat(newAmount),
      spent: 0,
    };

    setBudget(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));

    setNewCategory('');
    setNewAmount('');
    setIsAddingCategory(false);
  };

  const handleUpdateAmount = (itemId: string, amount: string) => {
    setBudget(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId 
          ? { ...item, amount: parseFloat(amount) || 0 } 
          : item
      ),
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setBudget(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budget</h1>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Create New Budget
          </button>
        </div>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Budgeted</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalBudgeted.toFixed(2)}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Spent</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalSpent.toFixed(2)}</dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Remaining</dt>
            <dd className={`mt-1 text-3xl font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${remainingBudget.toFixed(2)}
            </dd>
          </div>
        </div>
      </div>

      {/* Current Budget */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{budget.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Category
          </button>
        </div>

        <div className="border-t border-gray-200">
          {isAddingCategory && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Select a category</option>
                    {categories
                      .filter(cat => !budget.items.some(item => item.categoryId === cat.id))
                      .map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="md:w-1/4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Budgeted
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Spent
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Remaining
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Progress
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
                {budget.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <span 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.category.color }}
                        ></span>
                        {item.category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">$</span>
                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => handleUpdateAmount(item.id, e.target.value)}
                          className="w-20 text-right focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ${item.spent.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      item.amount - item.spent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${(item.amount - item.spent).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            item.spent > item.amount
                              ? 'bg-red-600'
                              : item.spent / item.amount > 0.8
                              ? 'bg-yellow-400'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, (item.spent / item.amount) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {Math.round((item.spent / item.amount) * 100)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    Total
                  </th>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    ${totalBudgeted.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    ${totalSpent.toFixed(2)}
                  </td>
                  <td className={`px-6 py-3 text-right text-sm font-medium ${
                    remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${remainingBudget.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          totalSpent > totalBudgeted
                            ? 'bg-red-600'
                            : totalSpent / totalBudgeted > 0.8
                            ? 'bg-yellow-400'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (totalSpent / totalBudgeted) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {Math.round((totalSpent / totalBudgeted) * 100)}%
                    </span>
                  </td>
                  <td className="px-6 py-3"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 