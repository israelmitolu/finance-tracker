import React, { useState } from 'react';
import { PlusCircle, Search, Edit, Trash2, Calendar, ArrowDown, ArrowUp, Filter } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import TransactionForm from './TransactionForm';
import { Transaction } from '../../types';

const TransactionList: React.FC = () => {
  const { transactions, categories, deleteTransaction } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get category by ID
  const getCategoryById = (id: string) => {
    return categories.find(c => c.id === id);
  };
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Transaction type filter
      const matchesType = filterType === 'all' || transaction.type === filterType;
      
      // Category filter
      const matchesCategory = filterCategory === '' || transaction.category === filterCategory;
      
      // Date range filter
      const date = new Date(transaction.date);
      const matchesDateFrom = filterDateFrom === '' || date >= new Date(filterDateFrom);
      const matchesDateTo = filterDateTo === '' || date <= new Date(filterDateTo);
      
      return matchesSearch && matchesType && matchesCategory && matchesDateFrom && matchesDateTo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleAddTransaction = () => {
    setEditTransaction(undefined);
    setShowForm(true);
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setShowForm(true);
  };
  
  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };
  
  return (
    <div className="space-y-4">
      {/* Header with add button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Transactions</h2>
        
        <button
          onClick={handleAddTransaction}
          className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Transaction
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          {/* Type filter */}
          <div className="flex">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-2 rounded-l-lg font-medium text-sm ${
                filterType === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-3 py-2 font-medium text-sm ${
                filterType === 'expense'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-3 py-2 rounded-r-lg font-medium text-sm ${
                filterType === 'income'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Income
            </button>
          </div>
          
          {/* Advanced filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter size={16} className="mr-2" />
            Filters {showFilters ? '▲' : '▼'}
          </button>
        </div>
        
        {/* Advanced filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category filter */}
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date range filter */}
            <div>
              <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                From Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date-from"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                  className="pl-10 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                To Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="date-to"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                  className="pl-10 p-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            {/* Clear filters button */}
            <div className="md:col-span-3 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-emerald-500 hover:text-emerald-600 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Transaction list */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTransactions.map(transaction => {
              const category = getCategoryById(transaction.category);
              
              return (
                <div 
                  key={transaction.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
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
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {transaction.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ backgroundColor: category?.color || '#CBD5E1' }}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {category?.name || 'Uncategorized'} • {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center justify-between">
                          <p className={`font-medium ${
                            transaction.type === 'income' 
                              ? 'text-green-500 dark:text-green-400' 
                              : 'text-red-500 dark:text-red-400'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                          
                          {/* Actions */}
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEditTransaction(transaction)}
                              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                              aria-label="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                              aria-label="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No transactions found</p>
            <button
              onClick={handleAddTransaction}
              className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Your First Transaction
            </button>
          </div>
        )}
      </div>
      
      {/* Transaction form modal */}
      {showForm && (
        <TransactionForm 
          onClose={() => setShowForm(false)} 
          editTransaction={editTransaction}
        />
      )}
    </div>
  );
};

export default TransactionList;