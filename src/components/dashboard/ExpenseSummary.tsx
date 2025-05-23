import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency, getCategoryTotals } from '../../utils/helpers';

const CustomTooltip = ({ active, payload }: any) => {
  const { preferences } = useFinance();
  
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatCurrency(data.amount, preferences.currency)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {`${data.percentage.toFixed(1)}%`}
        </p>
      </div>
    );
  }
  
  return null;
};

const ExpenseSummary: React.FC = () => {
  const { transactions, categories, monthlyData, preferences } = useFinance();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  // Filter for current month transactions
  const monthlyTransactions = transactions.filter(
    t => t.date.startsWith(monthlyData.month)
  );
  
  // Get category totals for pie chart
  let categoryData = getCategoryTotals(monthlyTransactions, categories)
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  
  // Calculate percentages
  const totalAmount = categoryData.reduce((sum, item) => sum + item.amount, 0);
  categoryData = categoryData.map(item => ({
    ...item,
    percentage: (item.amount / totalAmount) * 100
  }));
  
  // Handle empty data
  if (categoryData.length === 0) {
    categoryData = [{ categoryId: 'no-data', name: 'No expenses', color: '#CBD5E1', amount: 1, percentage: 100 }];
  }
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Expense Summary</h3>
      
      <div className="flex flex-col lg:flex-row items-start">
        {/* Pie Chart */}
        <div className="w-full lg:w-1/2 h-[250px] mb-4 lg:mb-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {categoryData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke={entry.color}
                    strokeWidth={activeIndex === index ? 2 : 0}
                    style={{
                      filter: activeIndex === index 
                        ? 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.3))' 
                        : 'none',
                      opacity: activeIndex === null || activeIndex === index ? 1 : 0.7,
                      transition: 'opacity 0.2s, filter 0.2s'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Category List */}
        <div className="w-full lg:w-1/2 lg:pl-4">
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
            {categoryData.map((category, index) => (
              <div 
                key={category.categoryId}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {formatCurrency(category.amount, preferences.currency)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;