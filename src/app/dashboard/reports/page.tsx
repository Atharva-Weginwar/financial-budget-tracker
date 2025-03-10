'use client';

import { useState } from 'react';

// Mock data for demonstration
const mockMonthlyData = [
  { month: 'Jan', income: 4200, expenses: 3800 },
  { month: 'Feb', income: 4500, expenses: 3900 },
  { month: 'Mar', income: 5250, expenses: 3720 },
  { month: 'Apr', income: 4800, expenses: 3600 },
  { month: 'May', income: 5100, expenses: 4200 },
  { month: 'Jun', income: 5300, expenses: 4100 },
];

const mockCategoryData = [
  { category: 'Housing', amount: 1200, percentage: 32 },
  { category: 'Food', amount: 600, percentage: 16 },
  { category: 'Transportation', amount: 400, percentage: 11 },
  { category: 'Utilities', amount: 300, percentage: 8 },
  { category: 'Entertainment', amount: 200, percentage: 5 },
  { category: 'Healthcare', amount: 350, percentage: 9 },
  { category: 'Personal', amount: 250, percentage: 7 },
  { category: 'Other', amount: 420, percentage: 12 },
];

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState('month');
  const [reportType, setReportType] = useState('overview');

  // Simple bar chart component
  const BarChart = ({ data, xKey, yKeys, colors }: any) => {
    const maxValue = Math.max(...data.flatMap((d: any) => yKeys.map((key: string) => d[key])));
    const barWidth = 100 / data.length / yKeys.length;
    
    return (
      <div className="w-full h-64 mt-4">
        <div className="relative h-full">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
            <div>{'$' + maxValue}</div>
            <div>{'$' + (maxValue * 0.75).toFixed(0)}</div>
            <div>{'$' + (maxValue * 0.5).toFixed(0)}</div>
            <div>{'$' + (maxValue * 0.25).toFixed(0)}</div>
            <div>$0</div>
          </div>
          
          {/* Chart area */}
          <div className="absolute left-12 right-0 top-0 bottom-0 border-l border-b border-gray-300">
            {/* Horizontal grid lines */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
            <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-200"></div>
            <div className="absolute left-0 right-0 top-2/4 h-px bg-gray-200"></div>
            <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-200"></div>
            
            {/* Bars */}
            <div className="absolute inset-0 flex items-end">
              {data.map((d: any, i: number) => (
                <div key={i} className="flex-1 flex justify-center">
                  {yKeys.map((key: string, j: number) => (
                    <div
                      key={j}
                      className="mx-1"
                      style={{
                        height: `${(d[key] / maxValue) * 100}%`,
                        width: `${barWidth}%`,
                        backgroundColor: colors[j],
                      }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* X-axis labels */}
            <div className="absolute left-0 right-0 bottom-0 translate-y-full flex justify-around text-xs text-gray-500 pt-2">
              {data.map((d: any, i: number) => (
                <div key={i}>{d[xKey]}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simple pie chart component
  const PieChart = ({ data }: any) => {
    let cumulativePercentage = 0;
    
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-4">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item: any, index: number) => {
              const startAngle = cumulativePercentage * 3.6; // 3.6 = 360 / 100
              cumulativePercentage += item.percentage;
              const endAngle = cumulativePercentage * 3.6;
              
              const startX = 50 + 50 * Math.cos((startAngle - 90) * (Math.PI / 180));
              const startY = 50 + 50 * Math.sin((startAngle - 90) * (Math.PI / 180));
              const endX = 50 + 50 * Math.cos((endAngle - 90) * (Math.PI / 180));
              const endY = 50 + 50 * Math.sin((endAngle - 90) * (Math.PI / 180));
              
              const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
              
              const colors = [
                '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', 
                '#F472B6', '#FB923C', '#4ADE80', '#38BDF8', '#6EE7B7'
              ];
              
              return (
                <path
                  key={index}
                  d={`M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                  fill={colors[index % colors.length]}
                />
              );
            })}
          </svg>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {data.map((item: any, index: number) => {
            const colors = [
              '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', 
              '#F472B6', '#FB923C', '#4ADE80', '#38BDF8', '#6EE7B7'
            ];
            
            return (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 mr-2 rounded-sm" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <div>
                  <div className="text-sm font-medium">{item.category}</div>
                  <div className="text-xs text-gray-500">${item.amount} ({item.percentage}%)</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="flex space-x-2">
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
            onClick={() => setTimeframe('quarter')}
            className={`px-3 py-1 text-sm rounded-md ${
              timeframe === 'quarter'
                ? 'bg-primary-100 text-primary-800'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Quarter
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

      {/* Report Type Selector */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Report Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setReportType('overview')}
            className={`p-4 rounded-lg border ${
              reportType === 'overview'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">Overview</div>
            <div className="text-sm text-gray-500">Income vs. Expenses</div>
          </button>
          
          <button
            onClick={() => setReportType('categories')}
            className={`p-4 rounded-lg border ${
              reportType === 'categories'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">Categories</div>
            <div className="text-sm text-gray-500">Spending by category</div>
          </button>
          
          <button
            onClick={() => setReportType('trends')}
            className={`p-4 rounded-lg border ${
              reportType === 'trends'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">Trends</div>
            <div className="text-sm text-gray-500">Spending over time</div>
          </button>
          
          <button
            onClick={() => setReportType('savings')}
            className={`p-4 rounded-lg border ${
              reportType === 'savings'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">Savings</div>
            <div className="text-sm text-gray-500">Savings rate analysis</div>
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {reportType === 'overview' && 'Income vs. Expenses'}
            {reportType === 'categories' && 'Spending by Category'}
            {reportType === 'trends' && 'Spending Trends'}
            {reportType === 'savings' && 'Savings Analysis'}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {timeframe === 'month' && 'Last 6 months'}
            {timeframe === 'quarter' && 'Last 4 quarters'}
            {timeframe === 'year' && 'Last 3 years'}
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {reportType === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Total Income</div>
                  <div className="text-2xl font-semibold text-gray-900">$29,150.00</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Total Expenses</div>
                  <div className="text-2xl font-semibold text-gray-900">$23,320.00</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Net Savings</div>
                  <div className="text-2xl font-semibold text-green-600">$5,830.00</div>
                </div>
              </div>
              
              <BarChart 
                data={mockMonthlyData} 
                xKey="month" 
                yKeys={["income", "expenses"]} 
                colors={["#34D399", "#F87171"]} 
              />
              
              <div className="flex justify-center mt-4">
                <div className="flex items-center mr-6">
                  <div className="w-4 h-4 bg-green-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-400 mr-2"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
              </div>
            </>
          )}
          
          {reportType === 'categories' && (
            <>
              <PieChart data={mockCategoryData} />
              
              <div className="mt-8">
                <h4 className="text-base font-medium text-gray-900 mb-4">Top Spending Categories</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          % of Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockCategoryData.map((category, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            ${category.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                            {category.percentage}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          
          {reportType === 'trends' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Trend analysis will be available in a future update.</p>
            </div>
          )}
          
          {reportType === 'savings' && (
            <div className="text-center py-12">
              <p className="text-gray-500">Savings analysis will be available in a future update.</p>
            </div>
          )}
        </div>
        
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-end">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Export as PDF
            </button>
            <button className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Export as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 