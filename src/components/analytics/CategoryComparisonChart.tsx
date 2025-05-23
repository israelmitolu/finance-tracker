import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency, getCategoryTotals } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }: any) => {
  const { preferences } = useFinance();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {formatCurrency(payload[0].value, preferences.currency)}
        </p>
      </div>
    );
  }
  
  return null;
};

const CategoryComparisonChart: React.FC = () => {
  const { transactions, categories, monthlyData } = useFinance();
  const [displayCount, setDisplayCount] = useState(5);
  
  // Filter transactions for current month
  const monthlyTransactions = transactions.filter(
    t => t.date.startsWith(monthlyData.month) && t.type === 'expense'
  );
  
  // Get category totals and sort by amount
  const categoryData = getCategoryTotals(monthlyTransactions, categories)
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, displayCount)
    .map(item => ({
      ...item,
      name: item.name,
      fill: item.color
    }));
  
  const showMore = () => {
    setDisplayCount(prev => Math.min(prev + 5, categories.length));
  };
  
  const showLess = () => {
    setDisplayCount(5);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Top Spending Categories</h3>
      
      {categoryData.length > 0 ? (
        <>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12, fill: '#94A3B8' }}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  tick={{ fontSize: 12, fill: '#94A3B8' }}
                  width={60}
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  radius={[0, 4, 4, 0]}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {categories.length > 5 && (
            <div className="mt-4 text-center">
              {displayCount < categories.length ? (
                <button 
                  onClick={showMore}
                  className="text-sm font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Show More Categories
                </button>
              ) : (
                <button 
                  onClick={showLess}
                  className="text-sm font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Show Less
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No expense data available for this month</p>
        </div>
      )}
    </div>
  );
};

export default CategoryComparisonChart;