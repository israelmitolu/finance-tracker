import React from 'react';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const RecentTransactions: React.FC = () => {
  const { transactions, categories, setCurrentView } = useFinance();
  
  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };
  
  const goToTransactions = () => {
    setCurrentView('transactions');
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Transactions</h3>
        <button 
          onClick={goToTransactions}
          className="text-sm font-medium text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => {
            const category = getCategoryById(transaction.category);
            
            return (
              <div 
                key={transaction.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {/* Icon */}
                <div 
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-500 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'income' ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </div>
                
                {/* Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: category?.color || '#CBD5E1' }}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {category?.name || 'Uncategorized'} • {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <p className={`font-medium ${
                      transaction.type === 'income' 
                        ? 'text-green-500 dark:text-green-400' 
                        : 'text-red-500 dark:text-red-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions yet</p>
            <button
              onClick={() => setCurrentView('transactions')}
              className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Plus size={16} className="mr-1" />
              Add Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;