import React, { useState } from 'react';
import { PlusCircle, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';
import { Category } from '../../types';
import { formatCurrency } from '../../utils/helpers';

const CategoryForm: React.FC<{
  onClose: () => void;
  editCategory?: Category;
}> = ({ onClose, editCategory }) => {
  const { addCategory, updateCategory } = useFinance();
  const [formData, setFormData] = useState({
    name: editCategory?.name || '',
    color: editCategory?.color || '#10B981',
    icon: editCategory?.icon || 'Tag',
    budget: editCategory?.budget ? String(editCategory.budget) : ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    budget: ''
  });
  
  const iconOptions = [
    'ShoppingBag', 'Car', 'Utensils', 'Home', 'Lightbulb', 
    'Film', 'Heart', 'GraduationCap', 'Briefcase', 'Plane',
    'Wifi', 'Gift', 'Coffee', 'Bus', 'Tag', 'DollarSign'
  ];
  
  const colorOptions = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#EAB308', // Yellow
    '#84CC16', // Lime
    '#10B981', // Emerald
    '#14B8A6', // Teal
    '#06B6D4', // Cyan
    '#0EA5E9', // Sky
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#A855F7', // Purple
    '#D946EF', // Fuchsia
    '#EC4899', // Pink
    '#F43F5E', // Rose
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {
      name: '',
      budget: ''
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
      isValid = false;
    }
    
    if (formData.budget && (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0)) {
      newErrors.budget = 'Budget must be a positive number';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const categoryData = {
      name: formData.name,
      color: formData.color,
      icon: formData.icon,
      budget: formData.budget ? Number(formData.budget) : undefined
    };
    
    if (editCategory) {
      updateCategory(editCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {editCategory ? 'Edit Category' : 'Add Category'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Groceries"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>
          
          {/* Color */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
          
          {/* Icon */}
          <div className="mb-4">
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            <select
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {iconOptions.map(icon => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
          </div>
          
          {/* Budget */}
          <div className="mb-6">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Budget (optional)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.budget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center"
            >
              <PlusCircle size={16} className="mr-1" />
              {editCategory ? 'Update' : 'Add'} Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CategoryManager: React.FC = () => {
  const { categories, transactions, deleteCategory, monthlyData, preferences } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>(undefined);
  
  const handleAddCategory = () => {
    setEditCategory(undefined);
    setShowForm(true);
  };
  
  const handleEditCategory = (category: Category) => {
    setEditCategory(category);
    setShowForm(true);
  };
  
  const handleDeleteCategory = (id: string) => {
    // Check if there are transactions with this category
    const hasTransactions = transactions.some(t => t.category === id);
    
    if (hasTransactions) {
      alert('Cannot delete a category that has transactions. Please reassign or delete those transactions first.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };
  
  // Calculate spending for each category in the current month
  const getCategorySpending = (categoryId: string) => {
    return transactions
      .filter(t => t.category === categoryId && t.date.startsWith(monthlyData.month) && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };
  
  // Calculate budget utilization percentage
  const getBudgetPercentage = (spent: number, budget?: number) => {
    if (!budget || budget <= 0) return 0;
    return Math.min(100, Math.round((spent / budget) * 100));
  };
  
  return (
    <div className="space-y-4">
      {/* Header with add button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Categories</h2>
        
        <button
          onClick={handleAddCategory}
          className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Category
        </button>
      </div>
      
      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => {
          const spending = getCategorySpending(category.id);
          const budgetPercentage = getBudgetPercentage(spending, category.budget);
          const isOverBudget = category.budget && spending > category.budget;
          
          return (
            <div 
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white text-xs font-bold">
                      {category.icon.substring(0, 1)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {category.name}
                  </h3>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded"
                    aria-label={`Delete ${category.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {/* Current month spending */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {monthlyData.month.replace('-', ' ')} Spending
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {formatCurrency(spending, preferences.currency)}
                  </p>
                </div>
                
                {/* Budget progress if available */}
                {category.budget && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Budget: {formatCurrency(category.budget, preferences.currency)}
                      </p>
                      <p className={`text-xs ${isOverBudget ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {budgetPercentage}% used
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isOverBudget ? 'bg-red-500' : 
                          budgetPercentage > 80 ? 'bg-amber-500' : 
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, budgetPercentage)}%` }}
                      />
                    </div>
                    
                    {/* Warning for over budget */}
                    {isOverBudget && (
                      <div className="mt-2 flex items-center text-red-500 dark:text-red-400 text-xs">
                        <AlertTriangle size={12} className="mr-1" />
                        <span>Over budget by {formatCurrency(spending - category.budget, preferences.currency)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Empty state */}
      {categories.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No categories yet</p>
          <button
            onClick={handleAddCategory}
            className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Your First Category
          </button>
        </div>
      )}
      
      {/* Category form modal */}
      {showForm && (
        <CategoryForm 
          onClose={() => setShowForm(false)} 
          editCategory={editCategory}
        />
      )}
    </div>
  );
};

export default CategoryManager;