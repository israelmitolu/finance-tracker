import React, { useState } from 'react';
import { Save, RefreshCw, Download, Trash2, AlertTriangle } from 'lucide-react';
import { useFinance } from '../../contexts/FinanceContext';

const SettingsPanel: React.FC = () => {
  const { preferences, updatePreferences, transactions, categories } = useFinance();
  
  const [formData, setFormData] = useState({
    currency: preferences.currency,
    monthlyBudget: preferences.monthlyBudget.toString(),
    darkMode: preferences.darkMode
  });
  
  const [errors, setErrors] = useState({
    monthlyBudget: ''
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const currencyOptions = [
    { value: 'NGN', label: 'Nigerian Naira (₦)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
    { value: 'JPY', label: 'Japanese Yen (¥)' },
    { value: 'CAD', label: 'Canadian Dollar (C$)' },
    { value: 'AUD', label: 'Australian Dollar (A$)' },
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'CNY', label: 'Chinese Yuan (¥)' },
    { value: 'BRL', label: 'Brazilian Real (R$)' },
    { value: 'MXN', label: 'Mexican Peso (Mex$)' }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error and success message when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSaveSuccess(false);
  };
  
  const validate = () => {
    const newErrors = {
      monthlyBudget: ''
    };
    
    let isValid = true;
    
    if (!formData.monthlyBudget || isNaN(Number(formData.monthlyBudget)) || Number(formData.monthlyBudget) < 0) {
      newErrors.monthlyBudget = 'Please enter a valid budget amount';
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
    
    updatePreferences({
      currency: formData.currency,
      monthlyBudget: Number(formData.monthlyBudget),
      darkMode: formData.darkMode
    });
    
    setSaveSuccess(true);
    
    // Apply dark mode immediately
    if (formData.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  const handleExportData = () => {
    const exportData = {
      transactions,
      categories,
      preferences
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all your financial data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">General Settings</h3>
          
          {/* Currency */}
          <div className="mb-4">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {currencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Monthly Budget */}
          <div className="mb-4">
            <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Monthly Budget
            </label>
            <input
              type="number"
              id="monthlyBudget"
              name="monthlyBudget"
              value={formData.monthlyBudget}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.monthlyBudget ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.monthlyBudget && (
              <p className="mt-1 text-sm text-red-500">{errors.monthlyBudget}</p>
            )}
          </div>
          
          {/* Dark Mode */}
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={formData.darkMode}
                onChange={handleChange}
                className="h-4 w-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500"
              />
              <label htmlFor="darkMode" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark Mode
              </label>
            </div>
          </div>
          
          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              <Save size={18} className="mr-2" />
              Save Settings
            </button>
          </div>
          
          {/* Success message */}
          {saveSuccess && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center">
              <RefreshCw size={16} className="mr-2" />
              Settings saved successfully!
            </div>
          )}
        </form>
      </div>
      
      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Data Management</h3>
        
        <div className="space-y-4">
          <div>
            <button
              onClick={handleExportData}
              className="inline-flex items-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            >
              <Download size={18} className="mr-2" />
              Export Data
            </button>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Download all your financial data as a JSON file
            </p>
          </div>
          
          <div>
            <button
              onClick={handleClearData}
              className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <Trash2 size={18} className="mr-2" />
              Clear All Data
            </button>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Delete all your financial data from this device
            </p>
          </div>
          
          <div className="p-3 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg flex items-start">
            <AlertTriangle size={16} className="mr-2 mt-1 flex-shrink-0" />
            <p className="text-sm">
              Data is currently stored in your browser's local storage. For security,
              regularly export your data as a backup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;