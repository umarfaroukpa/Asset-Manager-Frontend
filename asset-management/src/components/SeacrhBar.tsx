import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterOption {
  value: string;
  label: string;
}

interface SearchBarProps {
  onSearch: (search: string, filters?: Record<string, string>) => void;
  placeholder?: string;
  filters?: {
    [key: string]: {
      label: string;
      options: SearchFilterOption[];
      defaultValue?: string;
    };
  };
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
  filters = {},
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(filters).map(([key, config]) => [key, config.defaultValue || ''])
    )
  );
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(searchTerm, activeFilters);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    const clearedFilters = Object.fromEntries(
      Object.keys(activeFilters).map(key => [key, ''])
    );
    setActiveFilters(clearedFilters);
    onSearch('', clearedFilters);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '');

  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder={placeholder}
          />
          {(searchTerm || hasActiveFilters) && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {Object.keys(filters).length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                showFilters || hasActiveFilters 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          )}
          <button
            onClick={handleSearch}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && Object.keys(filters).length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(filters).map(([filterName, config]) => (
              <div key={filterName}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {config.label}
                </label>
                <select
                  value={activeFilters[filterName]}
                  onChange={(e) => handleFilterChange(filterName, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All {config.label}</option>
                  {config.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                const clearedFilters = Object.fromEntries(
                  Object.keys(activeFilters).map(key => [key, ''])
                );
                setActiveFilters(clearedFilters);
                onSearch(searchTerm, clearedFilters);
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
            <button
              onClick={() => {
                handleSearch();
                setShowFilters(false);
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;