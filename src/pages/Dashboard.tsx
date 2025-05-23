import React from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import ExpenseSummary from '../components/dashboard/ExpenseSummary';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import DailySpendingChart from '../components/dashboard/DailySpendingChart';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseSummary />
        <RecentTransactions />
      </div>
      
      <DailySpendingChart />
    </div>
  );
};

export default Dashboard;