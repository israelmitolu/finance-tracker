import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }: any) => {
  const { preferences } = useFinance();
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatCurrency(payload[0].value, preferences.currency)}
        </p>
      </div>
    );
  }
  
  return null;
};

const DailySpendingChart: React.FC = () => {
  const { transactions, monthlyData } = useFinance();
  
  // Filter transactions for current month
  const monthlyTransactions = transactions.filter(
    t => t.date.startsWith(monthlyData.month) && t.type === 'expense'
  );
  
  // Prepare daily spending data
  const getDailySpending = () => {
    const dailyMap = new Map<string, number>();
    
    // Get all days in the month
    const [year, month] = monthlyData.month.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
    
    // Initialize all days with zero
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
      dailyMap.set(dateStr, 0);
    }
    
    // Sum up transactions by date
    monthlyTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      if (dailyMap.has(dateStr)) {
        dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + transaction.amount);
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(dailyMap.entries())
      .map(([date, amount]) => ({
        date,
        day: parseInt(date.split('-')[2]),
        amount
      }))
      .sort((a, b) => a.day - b.day);
  };
  
  const dailyData = getDailySpending();
  
  // Format date for display on x-axis
  const formatXAxis = (dateStr: string) => {
    return dateStr.split('-')[2]; // Just show the day
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Daily Spending</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailyData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickMargin={8}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              hide={true}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailySpendingChart;