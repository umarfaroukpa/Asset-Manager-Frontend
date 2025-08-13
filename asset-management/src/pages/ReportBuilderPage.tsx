// Global type declarations the file
declare global {
  interface Window {
    jsPDF?: any;
    XLSX?: any;
  }
}

import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { BarChart2, PieChart, LineChart, FileText, TrendingUp, Calendar, MapPin, Package, Users, AlertTriangle, DollarSign, ArrowLeft, RefreshCw, Filter } from 'lucide-react';
import ReportBuilder from '../components/reports/ReportBuilder';
import { reportAPI } from '../services/api';



interface ReportType {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
  chartType: 'table' | 'bar' | 'line' | 'pie';
}

interface Filter {
  id: string;
  label: string;
  type: 'date' | 'select' | 'multiselect';
  options?: Array<{ value: string; label: string }>;
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
}interface ReportType {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
  chartType: 'table' | 'bar' | 'line' | 'pie';
}

interface Filter {
  id: string;
  label: string;
  type: 'date' | 'select' | 'multiselect';
  options?: Array<{ value: string; label: string }>;
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

interface AssetData {
  id: string;
  name: string;
  category: string;
  location: string;
  status: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  assignedTo?: string;
  assignedToId?: string;
  department?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  warrantyExpiry?: string;
  maintenanceHistory: MaintenanceRecord[];
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  cost: number;
  description: string;
  performedBy?: string;
  nextScheduled?: string;
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

interface SavedReport {
  id: string;
  name: string;
  type: string;
  filters: Record<string, any>;
  createdAt: string;
  lastModified: string;
  createdBy: string;
  description?: string;
}

interface Filters {
  categories: { value: string; label: string }[];
  locations: { value: string; label: string }[];
  departments: { value: string; label: string }[];
}
interface ReportBuilderPageProps {
  mode?: 'list' | 'create' | 'edit' | 'view';
}

type FilterOption = {
  value: string;
  label: string;
  [key: string]: any;
};
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  [key: string]: any;
};

const ReportBuilderPage: React.FC<ReportBuilderPageProps> = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'list' | 'create' | 'edit' | 'view'>('list');
  const [exportLoading, setExportLoading] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [libraryWarning, setLibraryWarning] = useState<boolean>(false);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [currentReport, setCurrentReport] = useState<SavedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dynamicFilters, setDynamicFilters] = useState<Filters>({
    categories: [],
    locations: [],
    departments: [],
  });
if (error) {
  return (
    <div className="p-4 bg-red-50 text-red-700">
      <h2>Error loading report data</h2>
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
  // Asset management specific report types
  const reportTypes = [
    {
      id: 'asset-inventory',
      name: 'Asset Inventory',
      icon: <Package className="w-6 h-6" />,
      description: 'Complete asset inventory with current status',
      chartType: 'table' as const,
    },
    {
      id: 'financial-summary',
      name: 'Financial Summary',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Asset values, depreciation, and financial metrics',
      chartType: 'bar' as const,
    },
    {
      id: 'depreciation-analysis',
      name: 'Depreciation Analysis',
      icon: <LineChart className="w-6 h-6" />,
      description: 'Asset depreciation trends over time',
      chartType: 'line' as const,
    },
    {
      id: 'category-distribution',
      name: 'Category Distribution',
      icon: <PieChart className="w-6 h-6" />,
      description: 'Asset distribution by categories',
      chartType: 'pie' as const,
    },
    {
      id: 'maintenance-report',
      name: 'Maintenance Report',
      icon: <FileText className="w-6 h-6" />,
      description: 'Maintenance activities and costs',
      chartType: 'table' as const,
    },
    {
      id: 'utilization-analysis',
      name: 'Utilization Analysis',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Asset utilization and efficiency metrics',
      chartType: 'bar' as const,
    },
    {
      id: 'compliance-audit',
      name: 'Compliance Audit',
      icon: <AlertTriangle className="w-6 h-6" />,
      description: 'Compliance status and audit trail',
      chartType: 'table' as const,
    },
    {
      id: 'assignment-report',
      name: 'Assignment Report',
      icon: <Users className="w-6 h-6" />,
      description: 'Asset assignments to employees/departments',
      chartType: 'table' as const,
    },
  ];

  // Base filters structure
  const baseFilters = [
    {
      id: 'dateFrom',
      label: 'Start Date',
      type: 'date' as const,
    },
    {
      id: 'dateTo',
      label: 'End Date',
      type: 'date' as const,
    },
    {
      id: 'status',
      label: 'Asset Status',
      type: 'multiselect' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'maintenance', label: 'Under Maintenance' },
        { value: 'repair', label: 'Under Repair' },
        { value: 'retired', label: 'Retired' },
        { value: 'disposed', label: 'Disposed' },
        { value: 'missing', label: 'Missing/Lost' },
      ],
    },
    {
      id: 'assignmentStatus',
      label: 'Assignment Status',
      type: 'select' as const,
      options: [
        { value: 'assigned', label: 'Assigned' },
        { value: 'unassigned', label: 'Unassigned' },
        { value: 'pool', label: 'Pool Asset' },
        { value: 'reserved', label: 'Reserved' },
      ],
    },
  ];

  const [availableFilters, setAvailableFilters] = useState(baseFilters);

  // Check for required libraries on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasJsPDF = !!window.jsPDF;
      const hasXLSX = !!(window as any).XLSX;
      if (!hasJsPDF && !hasXLSX) {
        setLibraryWarning(true);
      }
    }
  }, []);

  // Load dynamic filter options
  useEffect(() => {
    loadDynamicFilters();
  }, []);

  // Determine mode based on route
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname.includes('/reports/new')) {
      setMode('create');
    } else if (pathname.includes('/reports/edit/')) {
      setMode('edit');
      if (reportId) {
        loadReportForEdit(reportId);
      }
    } else if (pathname.includes('/reports/view/')) {
      setMode('view');
      if (reportId) {
        loadReportForView(reportId);
      }
    } else {
      setMode('list');
    }
  }, [location.pathname, reportId]);

  // Load saved reports for list mode
  useEffect(() => {
    if (mode === 'list') {
      loadSavedReports();
    }
  }, [mode]);

const loadDynamicFilters = async () => {
  try {
    setLoading(true);
    setApiError(null);
    
    console.log('🔄 Loading dynamic filters...');
    
    // Use Promise.allSettled to handle individual failures gracefully
    const results = await Promise.allSettled([
      reportAPI.getCategories(),
      reportAPI.getLocations(),
      reportAPI.getDepartments(),
    ]);
    
    // Extract results and handle errors individually
    const [categoriesResult, locationsResult, departmentsResult] = results;
    
    // Process categories
    let categories: Array<{value: string, label: string}> = [];
    if (categoriesResult.status === 'fulfilled') {
      categories = categoriesResult.value;
      console.log('✅ Categories loaded:', categories.length, 'items');
    } else {
      console.error('❌ Failed to load categories:', categoriesResult.reason);
    }
    
    // Process locations
    let locations: Array<{value: string, label: string}> = [];
    if (locationsResult.status === 'fulfilled') {
      locations = locationsResult.value;
      console.log('✅ Locations loaded:', locations.length, 'items');
    } else {
      console.error('❌ Failed to load locations:', locationsResult.reason);
    }
    
    // Process departments (handle demo endpoints gracefully)
    let departments: Array<{value: string, label: string}> = [];
    if (departmentsResult.status === 'fulfilled') {
      departments = departmentsResult.value;
      if (departments.length === 0) {
        console.log('ℹ️ Departments loaded: 0 items (demo endpoint or no data available)');
      } else {
        console.log('✅ Departments loaded:', departments.length, 'items');
      }
    } else {
      console.error('❌ Failed to load departments:', departmentsResult.reason);
      // Don't treat department failures as critical since the endpoint might be a demo
    }
    
    // Update dynamic filters state
    setDynamicFilters({
      categories,
      locations,
      departments,
    });
    
    // Create updated filters array
    const updatedFilters = [
      ...baseFilters,
      // Only add filters that have options
      ...(categories.length > 0 ? [{
        id: 'category',
        label: 'Asset Category',
        type: 'select' as const,
        options: categories,
      }] : []),
      ...(locations.length > 0 ? [{
        id: 'location',
        label: 'Location',
        type: 'select' as const,
        options: locations,
      }] : []),
      ...(departments.length > 0 ? [{
        id: 'department',
        label: 'Department',
        type: 'select' as const,
        options: departments,
      }] : []),
    ];
    
    setAvailableFilters(updatedFilters);
    
    // Only show warnings for actual failures, not demo endpoints
    const criticalFailures = [];
    if (categoriesResult.status === 'rejected') criticalFailures.push('Categories');
    if (locationsResult.status === 'rejected') criticalFailures.push('Locations');
    // Only include departments if it's an actual failure, not just empty data
    if (departmentsResult.status === 'rejected') {
      const error = departmentsResult.reason;
      if (error && !error.message?.includes('Demo')) {
        criticalFailures.push('Departments');
      }
    }
    
    if (criticalFailures.length > 0) {
      setApiError(`Some filter options could not be loaded: ${criticalFailures.join(', ')}. Basic filters are still available.`);
    }
    
    // Summary of what was loaded
    const summary = {
      categoriesCount: categories.length,
      locationsCount: locations.length,
      departmentsCount: departments.length,
      totalFilters: updatedFilters.length,
      availableFilters: updatedFilters.map(f => f.label).join(', ')
    };
    
    console.log('🎯 Dynamic filters loaded successfully:', summary);
    
    // Show info message if some endpoints are demo/placeholder
    if (departments.length === 0 && departmentsResult.status === 'fulfilled') {
      console.log('ℹ️ Some filter options may be unavailable due to demo/development endpoints');
    }
    
  } catch (error) {
    console.error('❌ Critical error loading dynamic filters:', error);
    setApiError('Failed to load filter options. Using basic filters only.');
    
    // Fallback to base filters only
    setAvailableFilters(baseFilters);
    setDynamicFilters({
      categories: [],
      locations: [],
      departments: [],
    });
  } finally {
    setLoading(false);
  }
};

  const loadSavedReports = async () => {
    try {
      setLoading(true);
      const reports = await reportAPI.getSavedReports();
      setSavedReports(reports);
    } catch (error) {
      console.error('Error loading saved reports:', error);
      setApiError('Failed to load saved reports.');
    } finally {
      setLoading(false);
    }
  };

  const loadReportForEdit = async (reportId: string) => {
    try {
      setLoading(true);
      const report = await reportAPI.getSavedReport(reportId);
      setCurrentReport(report);
    } catch (error) {
      console.error('Error loading report for edit:', error);
      setApiError('Failed to load report for editing.');
    } finally {
      setLoading(false);
    }
  };

  const loadReportForView = async (reportId: string) => {
    try {
      setLoading(true);
      const report = await reportAPI.getSavedReport(reportId);
      setCurrentReport(report);
    } catch (error) {
      console.error('Error loading report for view:', error);
      setApiError('Failed to load report.');
    } finally {
      setLoading(false);
    }
  };

  // Navigation handlers
  const handleCreateNew = () => {
    setCurrentReport(null);
    navigate('/reports/new');
  };

  const handleEditReport = (id: string) => {
    navigate(`/reports/edit/${id}`);
  };

  const handleViewReport = (id: string) => {
    navigate(`/reports/view/${id}`);
  };

  const handleBackToList = () => {
    setCurrentReport(null);
    navigate('/reports');
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) {
      return;
    }
    try {
      await reportAPI.deleteReport(reportId);
      await loadSavedReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      setApiError('Failed to delete report.');
    }
  };

  const handleGenerate = useCallback(async (reportType: string, filters: Record<string, any>): Promise<ReportData> => {
    setApiError(null);
    try {
      if (filters.dateFrom && filters.dateTo && new Date(filters.dateFrom) > new Date(filters.dateTo)) {
        throw new Error('Start date cannot be later than end date');
      }
      const reportData = await generateReportData(reportType, filters);
      return {
        reportType,
        filters,
        data: reportData,
        generatedAt: new Date().toISOString(),
        summary: generateSummary(reportData, reportType),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setApiError(errorMessage);
      throw error;
    }
  }, []);

  const generateReportData = async (reportType: string, filters: Record<string, any>) => {
    switch (reportType) {
      case 'asset-inventory':
        const assets = await reportAPI.getAssets(filters);
        return {
          headers: ['Asset ID', 'Name', 'Category', 'Location', 'Status', 'Current Value (₦)', 'Assigned To', 'Purchase Date', 'Serial Number'],
          tableData: assets.map((asset) => [
            asset.id,
            asset.name,
            asset.category,
            asset.location,
            asset.status,
            asset.currentValue?.toLocaleString() || '0',
            asset.assignedTo || 'Unassigned',
            asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A',
            asset.serialNumber || 'N/A',
          ]),
        };

      case 'financial-summary':
        const financialAssets = await reportAPI.getAssets(filters);
        const categoryTotals = financialAssets.reduce((acc, asset) => {
          acc[asset.category] = (acc[asset.category] || 0) + (asset.currentValue || 0);
          return acc;
        }, {} as Record<string, number>);
        return {
          chartData: Object.keys(categoryTotals).map((name) => ({ name, value: categoryTotals[name] })),
          totalValue: financialAssets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0),
          totalAssets: financialAssets.length,
          headers: ['Category', 'Total Value (₦)', 'Asset Count'],
          tableData: Object.keys(categoryTotals).map((category) => [
            category,
            categoryTotals[category].toLocaleString(),
            financialAssets.filter((a) => a.category === category).length.toString(),
          ]),
        };

      case 'depreciation-analysis':
        const depreciationData = await reportAPI.getDepreciationAnalysis(filters);
        return {
          chartData: depreciationData,
          headers: ['Period', 'Total Value (₦)', 'Depreciation (₦)', 'Asset Count'],
          tableData: depreciationData.map((item: any) => [
            item.period,
            item.totalValue?.toLocaleString() || '0',
            item.depreciation?.toLocaleString() || '0',
            item.assetCount || 0,
          ]),
        };

      case 'category-distribution':
        const distributionAssets = await reportAPI.getAssets(filters);
        const distribution = distributionAssets.reduce((acc, asset) => {
          acc[asset.category] = (acc[asset.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        return {
          chartData: Object.keys(distribution).map((name) => ({ name, value: distribution[name] })),
          headers: ['Category', 'Asset Count', 'Percentage'],
          tableData: Object.keys(distribution).map((category) => {
            const count = distribution[category];
            const percentage = ((count / distributionAssets.length) * 100).toFixed(1);
            return [category, count.toString(), `${percentage}%`];
          }),
        };

      case 'maintenance-report':
        const maintenanceAssets = await reportAPI.getAssets(filters);
        const assetIds = maintenanceAssets.map((a) => a.id);
        const maintenanceRecords = await reportAPI.getMaintenanceRecords(assetIds);
        return {
          headers: ['Asset ID', 'Asset Name', 'Maintenance Date', 'Type', 'Cost (₦)', 'Description', 'Performed By', 'Next Scheduled'],
          tableData: maintenanceRecords.map((record) => {
            const asset = maintenanceAssets.find((a) => a.id === record.id.split('-')[0]);
            return [
              asset?.id || 'N/A',
              asset?.name || 'N/A',
              record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
              record.type,
              record.cost?.toLocaleString() || '0',
              record.description,
              record.performedBy || 'N/A',
              record.nextScheduled ? new Date(record.nextScheduled).toLocaleDateString() : 'N/A',
            ];
          }),
        };

      case 'utilization-analysis':
        const utilizationData = await reportAPI.getUtilizationAnalysis(filters);
        return {
          chartData: utilizationData.chartData || [],
          headers: ['Asset', 'Utilization %', 'Hours Used', 'Efficiency Score'],
          tableData: utilizationData.details?.map((item: any) => [
            item.assetName,
            `${item.utilization}%`,
            item.hoursUsed?.toString() || '0',
            item.efficiencyScore?.toString() || 'N/A',
          ]) || [],
        };

      case 'compliance-audit':
        const complianceData = await reportAPI.getComplianceData(filters);
        return {
          headers: ['Asset ID', 'Asset Name', 'Compliance Status', 'Last Audit', 'Issues', 'Risk Level'],
          tableData: complianceData.map((item: any) => [
            item.assetId,
            item.assetName,
            item.status,
            item.lastAudit ? new Date(item.lastAudit).toLocaleDateString() : 'Never',
            item.issues?.toString() || '0',
            item.riskLevel || 'Unknown',
          ]),
        };

      case 'assignment-report':
        const assignmentAssets = await reportAPI.getAssets(filters);
        const assignedAssets = assignmentAssets.filter((a) => a.assignedTo);
        return {
          headers: ['Asset ID', 'Asset Name', 'Assigned To', 'Department', 'Assignment Date', 'Location', 'Status'],
          tableData: assignedAssets.map((asset) => [
            asset.id,
            asset.name,
            asset.assignedTo || 'Unassigned',
            asset.department || 'N/A',
            asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A',
            asset.location,
            asset.status,
          ]),
        };

      default:
        throw new Error(`Unknown report type: ${reportType}`);
    }
  };

  // GenerateSummary function to ensure it returns the correct type
const generateSummary = (reportData: any, reportType: string): {
  totalRecords: number;
  totalValue: number;
  categories: string[];
  locations?: string[];
  departments?: string[];
} => {
  if (reportType === 'asset-inventory' && reportData.tableData) {
    const totalValue = reportData.tableData.reduce((sum: number, row: any[]) => {
      const value = parseInt(row[5]?.replace(/,/g, '') || '0');
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    
    const categories = [...new Set(reportData.tableData.map((row: any[]) => row[2]))] as string[];
    const locations = [...new Set(reportData.tableData.map((row: any[]) => row[3]))] as string[];
    const departments = [...new Set(reportData.tableData.map((row: any[]) => row[6]))] as string[];
    
    return {
      totalRecords: reportData.tableData.length,
      totalValue: totalValue,
      categories: categories,
      locations: locations,
      departments: departments
    };
  }
  
  if (reportData.chartData) {
    const totalValue = reportData.totalValue || reportData.chartData.reduce((sum: number, item: any) => sum + (item.value || 0), 0);
    const categories = reportData.chartData.map((item: any) => item.name) as string[];
    
    return {
      totalRecords: reportData.chartData.length,
      totalValue: totalValue,
      categories: categories
    };
  }
  
  return {
    totalRecords: reportData.tableData?.length || 0,
    totalValue: 0,
    categories: []
  };
};

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-lg text-gray-600">Loading...</span>
        </div>
      );
    }
    switch (mode) {
      case 'create':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Reports
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Report</h1>
                  <p className="text-gray-600">Build a custom report for your asset management needs</p>
                </div>
              </div>
            </div>
            {renderReportBuilder()}
          </div>
        );

      case 'edit':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Reports
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Report</h1>
                  <p className="text-gray-600">
                    {currentReport ? `Editing: ${currentReport.name}` : `Report ID: ${reportId}`}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewReport(reportId!)}
                  className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Preview
                </button>
                <button
                  onClick={() => handleDeleteReport(reportId!)}
                  className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
            {currentReport && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-700">
                  <strong>Current Configuration:</strong> {currentReport.description || 'No description'}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Last modified: {new Date(currentReport.lastModified).toLocaleString()}
                </p>
              </div>
            )}
            {renderReportBuilder()}
          </div>
        );

      case 'view':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToList}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Reports
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentReport?.name || 'View Report'}
                  </h1>
                  <p className="text-gray-600">
                    {currentReport?.description || `Report ID: ${reportId}`}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditReport(reportId!)}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Edit Report
                </button>
                <button
                  onClick={() => handleDeleteReport(reportId!)}
                  className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
            {currentReport && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Report Type:</span>
                    <p className="text-gray-900">{reportTypes.find((rt) => rt.id === currentReport.type)?.name || currentReport.type}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created:</span>
                    <p className="text-gray-900">{new Date(currentReport.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Created By:</span>
                    <p className="text-gray-900">{currentReport.createdBy}</p>
                  </div>
                </div>
                {Object.keys(currentReport.filters || {}).length > 0 && (
                  <div className="mt-4">
                    <span className="font-medium text-gray-700">Applied Filters:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(currentReport.filters).map(([key, value]) => {
                        if (!value) return null;
                        const filter = availableFilters.find((f) => f.id === key);
                        return (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {filter?.label || key}: {Array.isArray(value) ? value.join(', ') : value}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            {renderReportBuilder()}
          </div>
        );

      case 'list':
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                <p className="text-gray-600">Manage and generate asset management reports</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                <FileText className="w-5 h-5 mr-2" />
                Create New Report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTypes.slice(0, 4).map((reportType) => (
                <div
                  key={reportType.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={handleCreateNew}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mb-4">
                    {reportType.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{reportType.name}</h3>
                  <p className="text-xs text-gray-600">{reportType.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Your Saved Reports</h3>
                <button
                  onClick={loadSavedReports}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                {savedReports.length > 0 ? (
                  savedReports.map((report) => (
                    <div key={report.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded">
                          {reportTypes.find((rt) => rt.id === report.type)?.icon || <FileText className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>Type: {reportTypes.find((rt) => rt.id === report.type)?.name || report.type}</span>
                            <span>Created: {new Date(report.createdAt).toLocaleDateString()}</span>
                            <span>Modified: {new Date(report.lastModified).toLocaleDateString()}</span>
                            <span>By: {report.createdBy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewReport(report.id)}
                          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEditReport(report.id)}
                          className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved reports yet</p>
                    <p className="text-sm text-gray-400 mt-1">Create your first report to get started</p>
                    <button
                      onClick={handleCreateNew}
                      className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Create Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  const renderReportBuilder = () => (
    <div className="space-y-4">
      {libraryWarning && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Enhanced Export Features Unavailable:</strong> For full PDF and Excel export functionality,
                please add the following scripts to your HTML head:
              </p>
              <div className="mt-2 text-xs text-yellow-600 bg-yellow-100 p-2 rounded font-mono">
                {`<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>`}<br />
                {`<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>`}
              </div>
              <p className="mt-2 text-xs text-yellow-600">
                CSV export and basic HTML exports will still work without these libraries.
              </p>
              <button
                onClick={() => setLibraryWarning(false)}
                className="mt-2 text-sm text-yellow-600 hover:text-yellow-500 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      {apiError && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{apiError}</p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => setApiError(null)}
                  className="text-sm text-red-600 hover:text-red-500 underline"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-red-600 hover:text-red-500 underline"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {exportLoading && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-sm text-blue-700">
              Exporting {exportLoading.toUpperCase()} file... Please wait.
            </p>
          </div>
        </div>
      )}
      <ReportBuilder
        reportTypes={reportTypes}
        availableFilters={availableFilters}
        onGenerate={handleGenerate}
        onExport={handleExport}
        initialReportType={currentReport?.type}
        initialFilters={currentReport?.filters}
        onSave={handleSaveReport}
        saveEnabled={mode === 'create' || mode === 'edit'}
      />
    </div>
  );

  const handleSaveReport = async (reportConfig: {
    name: string;
    type: string;
    filters: Record<string, any>;
    description?: string;
  }) => {
    try {
      if (mode === 'create') {
        await reportAPI.saveReport(reportConfig);
        navigate('/reports');
      } else if (mode === 'edit' && reportId) {
        await reportAPI.updateReport(reportId, {
          ...reportConfig,
          lastModified: new Date().toISOString(),
        });
        navigate('/reports');
      }
    } catch (error) {
      console.error('Error saving report:', error);
      setApiError('Failed to save report. Please try again.');
    }
  };

  const handleExport = useCallback(async (format: 'pdf' | 'csv' | 'excel', data: any) => {
    if (exportLoading) return;
    setApiError(null);
    setExportLoading(format);
    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(data);
          break;
        case 'csv':
          await exportToCSV(data);
          break;
        case 'excel':
          await exportToExcel(data);
          break;
      }
    } catch (error) {
      console.error(`${format.toUpperCase()} export failed:`, error);
      setApiError(`Failed to export ${format.toUpperCase()}. Please try again.`);
    } finally {
      setExportLoading(null);
    }
  }, [exportLoading]);

  const exportToPDF = async (data: ReportData) => {
    console.log('Exporting to PDF:', data);
  };

  const exportToCSV = async (data: ReportData) => {
    console.log('Exporting to CSV:', data);
  };

  const exportToExcel = async (data: ReportData) => {
    console.log('Exporting to Excel:', data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">{renderContent()}</div>
    </div>
  );
};

export default ReportBuilderPage;