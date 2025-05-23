import React, { useState } from "react";
import { Menu, X, Moon, Sun, DollarSign } from "lucide-react";
import { useFinance } from "../../contexts/FinanceContext";
import { View } from "../../types";

const Header: React.FC = () => {
  const { currentView, setCurrentView, preferences, updatePreferences } =
    useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: View; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "transactions", label: "Transactions" },
    { id: "analytics", label: "Analytics" },
    { id: "categories", label: "Categories" },
    { id: "settings", label: "Settings" },
  ];

  const toggleDarkMode = () => {
    updatePreferences({ darkMode: !preferences.darkMode });
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and title */}
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-500 text-white p-2 rounded-lg">
              <DollarSign size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              Mitolu Tracker 👀
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`font-medium transition-colors ${
                  currentView === item.id
                    ? "text-emerald-500 dark:text-emerald-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Dark mode toggle and mobile menu button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {preferences.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg font-medium transition-colors ${
                    currentView === item.id
                      ? "bg-emerald-50 text-emerald-500 dark:bg-gray-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
