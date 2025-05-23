import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency, getMonthFromDate } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }: any) => {
  const { preferences } = useFinance();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="font-medium">{label}</p>
        <div className="mt-1 space-y-1">
          <p className="text-sm text-red-500 dark:text-red-400 flex justify-between">
            <span>Expenses:</span>
            <span className="ml-4 font-medium">
              {formatCurrency(payload[0].value, preferences.currency)}
            </span>
          </p>
          <p className="text-sm text-green-500 dark:text-green-400 flex justify-between">
            <span>Income:</span>
            <span className="ml-4 font-medium">
              {formatCurrency(payload[1].value, preferences.currency)}
            </span>
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

const MonthlyTrendsChart: React.FC = () => {
  const { transactions, preferences } = useFinance();
  
  // Prepare monthly data for the chart
  const getMonthlyData = () => {
    const monthlyMap = new Map<string, { month: string, expenses: number, income: number }>();
    
    // Get the last 12 months
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleString('default', { month: 'short' });
      monthlyMap.set(monthStr, { 
        month: monthName, 
        expenses: 0, 
        income: 0 
      });
    }
    
    // Aggregate transactions by month
    transactions.forEach(transaction => {
      const monthKey = getMonthFromDate(transaction.date);
      if (monthlyMap.has(monthKey)) {
        const monthData = monthlyMap.get(monthKey)!;
        if (transaction.type === 'expense') {
          monthData.expenses += transaction.amount;
        } else {
          monthData.income += transaction.amount;
        }
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(monthlyMap.entries())
      .map(([key, data]) => ({
        monthKey: key,
        month: data.month,
        expenses: data.expenses,
        income: data.income
      }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey));
  };
  
  const monthlyData = getMonthlyData();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Monthly Trends</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={monthlyData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickMargin={10}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickFormatter={(value) => {
                return value >= 1000 ? `${Math.floor(value / 1000)}k` : value;
              }}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stroke="#EF4444" 
              fillOpacity={1}
              fill="url(#colorExpenses)" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#10B981" 
              fillOpacity={1}
              fill="url(#colorIncome)" 
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center mt-4 space-x-8">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendsChart;