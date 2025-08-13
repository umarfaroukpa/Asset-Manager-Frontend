import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Filter, Download, Edit, Trash2, Package, Eye, PieChart, Plus, Search, RefreshCw, LineChart, FileText, TrendingUp, Calendar, Users, AlertTriangle, DollarSign, } from 'lucide-react';


// Types
interface ReportType {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
  chartType: 'table' | 'bar' | 'line' | 'pie';
  color: string;
}

interface SavedReport {
  id: string;
  name: string;
  type: string;
  filters: Record<string, any>;
  createdAt: string;
  lastModified: string;
  createdBy: string;
  description?: string;
  isPublic?: boolean;
  scheduleEnabled?: boolean;
}

interface QuickStats {
  totalAssets: number;
  totalValue: number;
  reportsGenerated: number;
  lastUpdated: string;
}

const ReportsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    totalAssets: 0,
    totalValue: 0,
    reportsGenerated: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [apiError, setApiError] = useState<string | null>(null);

  // Report types configuration
  const reportTypes: ReportType[] = [
    {
      id: 'asset-inventory',
      name: 'Asset Inventory',
      icon: <Package className="w-6 h-6" />,
      description: 'Complete asset inventory with current status and assignments',
      chartType: 'table',
      color: 'bg-blue-500'
    },
    {
      id: 'financial-summary',
      name: 'Financial Summary',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Asset values, depreciation, and financial metrics overview',
      chartType: 'bar',
      color: 'bg-green-500'
    },
    {
      id: 'depreciation-analysis',
      name: 'Depreciation Analysis',
      icon: <LineChart className="w-6 h-6" />,
      description: 'Asset depreciation trends and value changes over time',
      chartType: 'line',
      color: 'bg-yellow-500'
    },
    {
      id: 'category-distribution',
      name: 'Category Distribution',
      icon: <PieChart className="w-6 h-6" />,
      description: 'Asset distribution across different categories',
      chartType: 'pie',
      color: 'bg-purple-500'
    },
    {
      id: 'maintenance-report',
      name: 'Maintenance Report',
      icon: <FileText className="w-6 h-6" />,
      description: 'Maintenance activities, costs, and scheduling',
      chartType: 'table',
      color: 'bg-orange-500'
    },
    {
      id: 'utilization-analysis',
      name: 'Utilization Analysis',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Asset utilization rates and efficiency metrics',
      chartType: 'bar',
      color: 'bg-indigo-500'
    },
    {
      id: 'compliance-audit',
      name: 'Compliance Audit',
      icon: <AlertTriangle className="w-6 h-6" />,
      description: 'Compliance status and audit trail reports',
      chartType: 'table',
      color: 'bg-red-500'
    },
    {
      id: 'assignment-report',
      name: 'Assignment Report',
      icon: <Users className="w-6 h-6" />,
      description: 'Asset assignments to employees and departments',
      chartType: 'table',
      color: 'bg-teal-500'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Simulate API calls - replace with actual API calls
      await Promise.all([
        loadSavedReports(),
        loadQuickStats()
      ]);
    } catch (error) {
      console.error('Error loading reports data:', error);
      setApiError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedReports = async () => {
    try {
      // Mock data - replace with actual API call
      const mockReports: SavedReport[] = [
        {
          id: '1',
          name: 'Monthly Asset Inventory',
          type: 'asset-inventory',
          filters: { dateFrom: '2025-01-01', dateTo: '2025-01-31' },
          createdAt: '2025-01-15T10:00:00Z',
          lastModified: '2025-01-20T14:30:00Z',
          createdBy: 'John Doe',
          description: 'Monthly comprehensive asset inventory report',
          isPublic: false,
          scheduleEnabled: true
        },
        {
          id: '2',
          name: 'Q4 Financial Summary',
          type: 'financial-summary',
          filters: { dateFrom: '2024-10-01', dateTo: '2024-12-31' },
          createdAt: '2024-12-15T09:00:00Z',
          lastModified: '2025-01-05T11:15:00Z',
          createdBy: 'Jane Smith',
          description: 'Quarterly financial performance and asset values',
          isPublic: true,
          scheduleEnabled: false
        }
      ];
      
      setSavedReports(mockReports);
    } catch (error) {
      console.error('Error loading saved reports:', error);
      setSavedReports([]);
    }
  };

  const loadQuickStats = async () => {
    try {
      // Mock data - replace with actual API call
      const stats: QuickStats = {
        totalAssets: 1250,
        totalValue: 2850000,
        reportsGenerated: 15,
        lastUpdated: new Date().toISOString()
      };
      
      setQuickStats(stats);
    } catch (error) {
      console.error('Error loading quick stats:', error);
    }
  };

  // Filter reports based on search and type
  const filteredReports = savedReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Navigation handlers
  const handleCreateNew = () => {
    navigate('/reports/new');
  };

  const handleQuickGenerate = (reportType: string) => {
    navigate('/reports/new', { state: { reportType } });
  };

  const handleViewReport = (reportId: string) => {
    navigate(`/reports/view/${reportId}`);
  };

  const handleEditReport = (reportId: string) => {
    navigate(`/reports/edit/${reportId}`);
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }
    
    try {
      // Replace with actual API call
      console.log('Deleting report:', reportId);
      setSavedReports(prev => prev.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      setApiError('Failed to delete report. Please try again.');
    }
  };

  const handleExportReport = async (reportId: string, format: 'pdf' | 'csv' | 'excel') => {
    try {
      // Replace with actual API call
      console.log('Exporting report:', reportId, 'as', format);
      // Show success message or trigger download
    } catch (error) {
      console.error('Error exporting report:', error);
      setApiError('Failed to export report. Please try again.');
    }
  };

  const getReportTypeInfo = (typeId: string) => {
    return reportTypes.find(type => type.id === typeId) || {
      id: typeId,
      name: typeId,
      icon: <FileText className="w-4 h-4" />,
      description: 'Unknown report type',
      chartType: 'table' as const,
      color: 'bg-gray-500'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="text-lg text-gray-600">Loading reports...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
            <p className="text-gray-600 mt-2">Generate, manage, and export asset management reports</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Report
          </button>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
              <div>
                <p className="text-sm text-red-700">{apiError}</p>
                <button
                  onClick={() => setApiError(null)}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.totalAssets.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₦{quickStats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reports Generated</p>
                <p className="text-2xl font-bold text-gray-900">{quickStats.reportsGenerated}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(quickStats.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Report Generation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Report Generation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.slice(0, 4).map((reportType) => (
              <div
                key={reportType.id}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => handleQuickGenerate(reportType.id)}
              >
                <div className={`flex items-center justify-center w-12 h-12 ${reportType.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="text-white">
                    {reportType.icon}
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{reportType.name}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{reportType.description}</p>
                <div className="mt-4 flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                  <span>Generate Now</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Reports */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Your Saved Reports</h3>
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Filter */}
                <div className="relative">
                  <select
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    {reportTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
                {/* Refresh */}
                <button
                  onClick={loadData}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => {
                const reportTypeInfo = getReportTypeInfo(report.type);
                return (
                  <div key={report.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className={`flex items-center justify-center w-10 h-10 ${reportTypeInfo.color} rounded-lg flex-shrink-0`}>
                          <div className="text-white text-sm">
                            {reportTypeInfo.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-sm font-medium text-gray-900 truncate">{report.name}</h4>
                            {report.isPublic && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Public
                              </span>
                            )}
                            {report.scheduleEnabled && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <Calendar className="w-3 h-3 mr-1" />
                                Scheduled
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1 truncate">{report.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                            <span className="flex items-center">
                              <span className="font-medium">Type:</span>
                              <span className="ml-1">{reportTypeInfo.name}</span>
                            </span>
                            <span className="flex items-center">
                              <span className="font-medium">Created:</span>
                              <span className="ml-1">{new Date(report.createdAt).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center">
                              <span className="font-medium">Modified:</span>
                              <span className="ml-1">{new Date(report.lastModified).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center">
                              <span className="font-medium">By:</span>
                              <span className="ml-1">{report.createdBy}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewReport(report.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditReport(report.id)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Report"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          {/* Export dropdown */}
                          <div className="absolute right-0 top-10 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                            <button
                              onClick={() => handleExportReport(report.id, 'pdf')}
                              className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Export PDF
                            </button>
                            <button
                              onClick={() => handleExportReport(report.id, 'csv')}
                              className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Export CSV
                            </button>
                            <button
                              onClick={() => handleExportReport(report.id, 'excel')}
                              className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Export Excel
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-12 text-center">
                {searchTerm || selectedType !== 'all' ? (
                  <>
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reports found matching your criteria</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your search terms or filters</p>
                  </>
                ) : (
                  <>
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No saved reports yet</p>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Create your first report to get started with asset analytics</p>
                    <button
                      onClick={handleCreateNew}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Report
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Additional Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <BarChart className="w-6 h-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">View comprehensive analytics and insights about your assets.</p>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View Analytics →
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Scheduled Reports</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Set up automated report generation and delivery schedules.</p>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              Manage Schedules →
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Shared Reports</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">Access reports shared by other users in your organization.</p>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View Shared →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsListPage;