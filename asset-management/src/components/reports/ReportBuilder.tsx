import React, { useState } from 'react';
import { Download, Printer, FileText, BarChart2, PieChart, LineChart } from 'lucide-react';
import Button from '../common/Button';
import Select from '../common/Select';

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
  type: 'select' | 'date' | 'multiselect';
  options?: { value: string; label: string }[];
}

interface ReportBuilderProps {
  reportTypes: ReportType[];
  availableFilters: ReportFilter[];
  onGenerate: (reportType: string, filters: Record<string, any>) => Promise<any>;
  onExport: (format: 'pdf' | 'csv' | 'excel', data: any) => void;
}

const ReportBuilder: React.FC<ReportBuilderProps> = ({
  reportTypes = [],
  availableFilters = [],
  onGenerate,
  onExport
}) => {
  const [selectedReport, setSelectedReport] = useState<string>(reportTypes[0]?.id || '');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const generateReport = async () => {
    if (!selectedReport) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await onGenerate(selectedReport, filters);
      setGeneratedReport(data);
    } catch (error) {
      console.error('Error generating report:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentReportType = reportTypes.find(rt => rt.id === selectedReport);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Report Builder</h2>
        <p className="text-sm text-gray-500">Create custom reports for your assets</p>
      </div>
      
      <div className="p-6">
        {/* Report Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {reportTypes.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors ${
                  selectedReport === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-center mb-2 text-blue-600">
                  {type.icon}
                </div>
                <h3 className="text-sm font-medium text-gray-900">{type.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filters</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableFilters.map(filter => (
              <div key={filter.id}>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {filter.label}
                </label>
                {filter.type === 'select' ? (
                  <Select
                    value={filters[filter.id] || ''}
                    onChange={(value) => handleFilterChange(filter.id, value)}
                    options={filter.options || []}
                    placeholder={`Select ${filter.label}`}
                  />
                ) : (
                  <input
                    type={filter.type === 'date' ? 'date' : 'text'}
                    value={filters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generate Report */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={generateReport}
            variant="primary"
            loading={loading}
            icon={<BarChart2 className="w-5 h-5 mr-2" />}
          >
            Generate Report
          </Button>
          
          {generatedReport && (
            <div className="flex space-x-2">
              <Button
                onClick={() => onExport('pdf', generatedReport)}
                variant="secondary"
                icon={<FileText className="w-5 h-5 mr-2" />}
              >
                PDF
              </Button>
              <Button
                onClick={() => onExport('csv', generatedReport)}
                variant="secondary"
                icon={<Download className="w-5 h-5 mr-2" />}
              >
                CSV
              </Button>
              <Button
                onClick={() => window.print()}
                variant="secondary"
                icon={<Printer className="w-5 h-5 mr-2" />}
              >
                Print
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Report Preview */}
        {generatedReport && currentReportType && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {currentReportType.name} Report
              </h3>
              <button
                onClick={() => setGeneratedReport(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg flex items-center justify-center">
              <div className="text-center">
                {currentReportType.chartType === 'bar' && <BarChart2 className="w-12 h-12 mx-auto text-gray-400 mb-2" />}
                {currentReportType.chartType === 'pie' && <PieChart className="w-12 h-12 mx-auto text-gray-400 mb-2" />}
                {currentReportType.chartType === 'line' && <LineChart className="w-12 h-12 mx-auto text-gray-400 mb-2" />}
                <p className="text-gray-500">Report preview would appear here</p>
                <p className="text-xs text-gray-400 mt-2">
                  Generated at {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportBuilder;