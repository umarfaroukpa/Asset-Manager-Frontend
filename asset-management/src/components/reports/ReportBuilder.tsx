import React, { useState, useCallback, useRef } from 'react';
import { Download, Printer, FileText, BarChart2, PieChart, LineChart, X, AlertCircle, CheckCircle, RefreshCw, Filter, Eye, Calendar, TrendingUp, Loader2} from 'lucide-react';
  

interface ReportType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  chartType: 'bar' | 'pie' | 'line' | 'table';
}

interface ReportFilter {
  id: string;
  label: string;
  type: 'select' | 'date' | 'multiselect' | 'text' | 'number';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface Filter {
  id: string;
  label: string;
  type: 'select' | 'date' | 'multiselect' | 'text' | 'number';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface ReportData {
  reportType: string;
  filters: Record<string, any>;
  data: any;
  generatedAt: string;
  summary?: {
    totalRecords: number;
    totalValue: number;
    categories: string[];
    locations?: string[];
    departments?: string[];
  };
}

interface ReportBuilderProps {
  reportTypes: ReportType[];
  availableFilters: Filter[];
  onGenerate: (reportType: string, filters: Record<string, any>) => Promise<ReportData>;
  onExport: (format: 'pdf' | 'csv' | 'excel', data: ReportData) => Promise<void>;
  onSave: (reportConfig: {
    name: string;
    type: string;
    filters: Record<string, any>;
    description?: string;
  }) => Promise<void>;
  initialReportType?: string;
  initialFilters?: Record<string, any>;
  saveEnabled: boolean;
}
interface ValidationError {
  field: string;
  message: string;
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({
  reportTypes = [],
  availableFilters = [],
  onGenerate,
  onExport,
  onSave,
  initialReportType,
  initialFilters = {},
  saveEnabled
}) => {
  const [selectedReport, setSelectedReport] = useState<string>(reportTypes[0]?.id || '');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Validation function
  const validateFilters = useCallback((): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    availableFilters.forEach(filter => {
      if (filter.required && !filters[filter.id]) {
        errors.push({
          field: filter.id,
          message: `${filter.label} is required`
        });
      }
      
      // Date validation
      if (filter.type === 'date' && filters[filter.id]) {
        const date = new Date(filters[filter.id]);
        if (isNaN(date.getTime())) {
          errors.push({
            field: filter.id,
            message: `${filter.label} must be a valid date`
          });
        }
      }
      
      // Number validation
      if (filter.type === 'number' && filters[filter.id] && isNaN(Number(filters[filter.id]))) {
        errors.push({
          field: filter.id,
          message: `${filter.label} must be a valid number`
        });
      }
    });
    
    // Cross-field validation
    if (filters.dateFrom && filters.dateTo) {
      const fromDate = new Date(filters.dateFrom);
      const toDate = new Date(filters.dateTo);
      if (fromDate > toDate) {
        errors.push({
          field: 'dateTo',
          message: 'End date must be after start date'
        });
      }
    }
    
    return errors;
  }, [availableFilters, filters]);

  const handleFilterChange = useCallback((filterId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
    
    // Clear validation error for this field
    setValidationErrors(prev => prev.filter(error => error.field !== filterId));
    setError(null);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setValidationErrors([]);
    setError(null);
  }, []);

  const generateReport = useCallback(async () => {
    if (!selectedReport) {
      setError('Please select a report type');
      return;
    }
    
    // Validate filters
    const errors = validateFilters();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors below');
      return;
    }
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);
    setValidationErrors([]);
    
    try {
      const data = await onGenerate(selectedReport, filters);
      setGeneratedReport(data);
      setLastGenerated(new Date());
      setRetryCount(0);
    } catch (error: any) {
      console.error('Error generating report:', error);
      
      if (error.name === 'AbortError') {
        return; // Request was cancelled
      }
      
      let errorMessage = 'Failed to generate report. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 404) {
        errorMessage = 'Report service not found. Please contact support.';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [selectedReport, filters, validateFilters, onGenerate]);

  const retryGeneration = useCallback(() => {
    generateReport();
  }, [generateReport]);

  const cancelGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setError(null);
    }
  }, []);

  const handleExport = useCallback((format: 'pdf' | 'csv' | 'excel') => {
    if (!generatedReport) return;
    
    try {
      onExport(format, generatedReport);
    } catch (error) {
      console.error(`Export error:`, error);
      setError(`Failed to export ${format.toUpperCase()}. Please try again.`);
    }
  }, [generatedReport, onExport]);

  const currentReportType = reportTypes.find(rt => rt.id === selectedReport);
  const hasValidationErrors = validationErrors.length > 0;
  const canGenerate = selectedReport && !loading && !hasValidationErrors;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <BarChart2 className="w-6 h-6 mr-2 text-blue-600" />
              Report Builder
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Generate comprehensive reports for asset management
            </p>
          </div>
          
          {lastGenerated && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Last generated</p>
              <p className="text-sm text-gray-700">{lastGenerated.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {/* Report Type Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Select Report Type
            </label>
            <span className="text-xs text-gray-500">
              {reportTypes.length} available reports
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`group p-4 border-2 rounded-xl text-center transition-all duration-200 hover:shadow-lg ${
                  selectedReport === type.id 
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className={`flex justify-center mb-3 transition-colors ${
                  selectedReport === type.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-500'
                }`}>
                  {type.icon}
                </div>
                <h3 className={`text-sm font-medium mb-1 ${
                  selectedReport === type.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {type.name}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">{type.description}</p>
                
                {selectedReport === type.id && (
                  <div className="mt-2 flex justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center text-sm font-semibold text-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Report Filters
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Eye className="w-4 h-4 mr-1" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
              {Object.keys(filters).length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </button>
              )}
            </div>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              {availableFilters.map(filter => (
                <div key={filter.id} className="space-y-1">
                  <label className="flex items-center text-xs font-medium text-gray-700">
                    {filter.label}
                    {filter.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  
                  {filter.type === 'select' ? (
                    <select
                      value={filters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className={`block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.some(err => err.field === filter.id)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <option value="">
                        {filter.placeholder || `Select ${filter.label}`}
                      </option>
                      {filter.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : filter.type === 'multiselect' ? (
                    <select
                      multiple
                      value={filters[filter.id] || []}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        handleFilterChange(filter.id, values);
                      }}
                      className={`block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.some(err => err.field === filter.id)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                      size={3}
                    >
                      {filter.options?.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={filter.type === 'date' ? 'date' : filter.type === 'number' ? 'number' : 'text'}
                      value={filters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      placeholder={filter.placeholder}
                      className={`block w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationErrors.some(err => err.field === filter.id)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    />
                  )}
                  
                  {/* Field-specific validation error */}
                  {validationErrors.find(err => err.field === filter.id) && (
                    <p className="text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {validationErrors.find(err => err.field === filter.id)?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {hasValidationErrors && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Generate Report Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={generateReport}
              disabled={!canGenerate}
              className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                canGenerate
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Generate Report
                </>
              )}
            </button>
            
            {loading && (
              <button
                onClick={cancelGeneration}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            )}
            
            {error && retryCount > 0 && retryCount < 3 && (
              <button
                onClick={retryGeneration}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry ({retryCount}/3)
              </button>
            )}
          </div>
          
          {/* Export Options */}
          {generatedReport && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Export:</span>
              <button
                onClick={() => handleExport('pdf')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
              >
                <FileText className="w-4 h-4 mr-1" />
                PDF
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
              >
                <FileText className="w-4 h-4 mr-1" />
                Excel
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
              >
                <Download className="w-4 h-4 mr-1" />
                CSV
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
              >
                <Printer className="w-4 h-4 mr-1" />
                Print
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-red-700 font-medium">Error</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                {retryCount >= 3 && (
                  <p className="text-xs text-red-500 mt-2">
                    Maximum retry attempts reached. Please check your connection and try again later.
                  </p>
                )}
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
              <div>
                <p className="text-sm font-medium text-blue-900">Generating your report...</p>
                <p className="text-xs text-blue-600 mt-1">
                  This may take a few moments depending on the data size
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Report Preview */}
        {generatedReport && currentReportType && !loading && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentReportType.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Generated successfully • {new Date(generatedReport.generatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setGeneratedReport(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Report Summary */}
            {generatedReport.summary && (
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Report Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Records:</span>
                    <span className="font-medium ml-2">{generatedReport.summary.totalRecords.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Value:</span>
                    <span className="font-medium ml-2">₦{generatedReport.summary.totalValue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Categories:</span>
                    <span className="font-medium ml-2">{generatedReport.summary.categories.length}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Report Content Preview */}
            <div className="p-8 bg-gray-50 flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                {currentReportType.chartType === 'bar' && <BarChart2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />}
                {currentReportType.chartType === 'pie' && <PieChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />}
                {currentReportType.chartType === 'line' && <LineChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />}
                {currentReportType.chartType === 'table' && <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />}
                
                <div className="space-y-2">
                  <p className="text-gray-600 font-medium">Report Generated Successfully</p>
                  <p className="text-sm text-gray-500">
                    {generatedReport.data?.tableData ? 
                      `${generatedReport.data.tableData.length} records found` :
                      `Data processed and ready for export`
                    }
                  </p>
                  <p className="text-xs text-gray-400">
                    Use the export buttons above to download your report
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportBuilder;