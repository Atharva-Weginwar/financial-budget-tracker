'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for demonstration
const mockGoals = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 4500,
    targetDate: '2023-12-31',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'New Car',
    targetAmount: 25000,
    currentAmount: 8000,
    targetDate: '2024-06-30',
    createdAt: '2023-02-01',
  },
  {
    id: '3',
    name: 'Vacation',
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: '2023-08-15',
    createdAt: '2023-01-20',
  },
  {
    id: '4',
    name: 'Home Down Payment',
    targetAmount: 50000,
    currentAmount: 15000,
    targetDate: '2025-01-01',
    createdAt: '2022-11-10',
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useState(mockGoals);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
  });
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) return;

    const goal = {
      id: `goal-${Date.now()}`,
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      targetDate: newGoal.targetDate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
    });
    setIsAddingGoal(false);
  };

  const handleUpdateGoal = (goalId: string, field: string, value: string) => {
    setGoals(prev =>
      prev.map(goal => {
        if (goal.id === goalId) {
          if (field === 'targetAmount' || field === 'currentAmount') {
            return { ...goal, [field]: parseFloat(value) || 0 };
          }
          return { ...goal, [field]: value };
        }
        return goal;
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No target date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100));
  };

  const calculateTimeRemaining = (targetDate: string) => {
    if (!targetDate) return 'No target date';
    
    const target = new Date(targetDate);
    const now = new Date();
    
    // If target date is in the past
    if (target < now) {
      return 'Past due';
    }
    
    const diffTime = Math.abs(target.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days left`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} left`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''} left`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Savings Goals</h1>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors"
        >
          Add New Goal
        </button>
      </div>

      {/* Add New Goal Form */}
      {isAddingGoal && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Savings Goal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Goal Name
              </label>
              <input
                type="text"
                id="name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500"
                placeholder="e.g. Emergency Fund"
              />
            </div>
            
            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Target Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="targetAmount"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="focus:ring-secondary-500 focus:border-secondary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Current Amount (Optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="currentAmount"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                  className="focus:ring-secondary-500 focus:border-secondary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-1">
                Target Date (Optional)
              </label>
              <input
                type="date"
                id="targetDate"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingGoal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddGoal}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              Create Goal
            </button>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{goal.name}</h3>
              {goal.targetDate && (
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Target: {formatDate(goal.targetDate)}
                </p>
              )}
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-500">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  {calculateProgress(goal.currentAmount, goal.targetAmount)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="h-4 rounded-full bg-secondary-500"
                  style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                ></div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Current</p>
                  <p className="text-lg font-semibold text-gray-900">${goal.currentAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Target</p>
                  <p className="text-lg font-semibold text-gray-900">${goal.targetAmount.toFixed(2)}</p>
                </div>
              </div>
              
              {goal.targetDate && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Time Remaining</p>
                  <p className="text-base font-medium text-gray-900">{calculateTimeRemaining(goal.targetDate)}</p>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                {editingGoalId === goal.id ? (
                  <>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={goal.currentAmount}
                        onChange={(e) => handleUpdateGoal(goal.id, 'currentAmount', e.target.value)}
                        className="focus:ring-secondary-500 focus:border-secondary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <button
                      onClick={() => setEditingGoalId(null)}
                      className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingGoalId(goal.id)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
                    >
                      Update Progress
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {goals.length === 0 && (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No savings goals</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new savings goal.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setIsAddingGoal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 