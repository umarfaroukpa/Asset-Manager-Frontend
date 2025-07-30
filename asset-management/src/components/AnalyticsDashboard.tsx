import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, TimeScale, Filler } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, subDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
  Filler
);

interface AnalyticsData {
  date: string;
  count: number;
  [key: string]: any;
}

interface AnalyticsDashboardProps {
  userData: AnalyticsData[];
  assetData: AnalyticsData[];
  activityData: AnalyticsData[];
  loading: boolean;
  refreshData: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  userData, 
  assetData, 
  activityData,
  loading,
  refreshData
}) => {
  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    key: 'selection'
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Process data for charts
  const processedUserData = processUserGrowthData(userData, dateRange);
  const processedAssetData = processAssetDistribution(assetData);
  const processedActivityData = processActivityTrends(activityData, dateRange);

  // User Growth Chart
  const userGrowthChart = {
    labels: processedUserData.map(data => format(new Date(data.date), 'MMM dd')),
    datasets: [
      {
        label: 'New Users',
        data: processedUserData.map(data => data.count),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: {
            target: 'origin',
            above: 'rgba(99, 102, 241, 0.1)',
            below: 'rgba(99, 102, 241, 0.1)'
        }
      }
    ]
  };

  // Asset Distribution Chart
  const assetDistributionChart = {
    labels: processedAssetData.map(data => data.category),
    datasets: [
      {
        label: 'Assets by Category',
        data: processedAssetData.map(data => data.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 1,
      }
    ]
  };

  // Activity Trend Chart
  const activityTrendChart = {
    labels: processedActivityData.map(data => format(new Date(data.date), 'MMM dd')),
    datasets: [
      {
        label: 'Daily Activity',
        data: processedActivityData.map(data => data.count),
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
      }
    ]
  };

  const handleDateChange = (ranges: any) => {
    setDateRange(ranges.selection);
    setShowDatePicker(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        
        <div className="relative">
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {format(dateRange.startDate, 'MMM dd, yyyy')} - {format(dateRange.endDate, 'MMM dd, yyyy')}
          </button>
          
          {showDatePicker && (
            <div className="absolute right-0 mt-2 z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
              <DateRangePicker
                ranges={[dateRange]}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button 
                  onClick={() => setShowDatePicker(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowDatePicker(false);
                    refreshData();
                  }}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold">
            {userData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {processedUserData[processedUserData.length - 1]?.count || 0} new this period
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Assets</h3>
          <p className="text-3xl font-bold">
            {assetData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Across {processedAssetData.length} categories
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Activity</h3>
          <p className="text-3xl font-bold">
            {activityData.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {processedActivityData[processedActivityData.length - 1]?.count || 0} today
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">User Growth</h3>
          <Line 
            data={userGrowthChart}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                tooltip: { mode: 'index', intersect: false }
              },
              scales: {
                x: { 
                  type: 'time',
                  time: { unit: 'day' }
                },
                y: { beginAtZero: true }
              },
              interaction: { mode: 'nearest', axis: 'x', intersect: false }
            }}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Asset Distribution</h3>
          <div className="h-64">
            <Pie 
              data={assetDistributionChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Activity Trends</h3>
        <Bar 
          data={activityTrendChart}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' }
            },
            scales: {
              x: {
                type: 'time',
                time: { unit: 'day' }
              },
              y: { beginAtZero: true }
            }
          }}
        />
      </div>
    </div>
  );
};

// Helper functions
const processUserGrowthData = (data: AnalyticsData[], range: any) => {
  const filtered = data.filter(item => {
    const date = new Date(item.date);
    return date >= range.startDate && date <= range.endDate;
  });
  
  // Group by day
  const dailyCounts: Record<string, number> = {};
  
  filtered.forEach(item => {
    const dateStr = format(new Date(item.date), 'yyyy-MM-dd');
    if (!dailyCounts[dateStr]) {
      dailyCounts[dateStr] = 0;
    }
    dailyCounts[dateStr] += item.count;
  });
  
  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count
  }));
};

const processAssetDistribution = (data: AnalyticsData[]) => {
  const categoryCounts: Record<string, number> = {};
  
  data.forEach(item => {
    if (!categoryCounts[item.category]) {
      categoryCounts[item.category] = 0;
    }
    categoryCounts[item.category] += item.count;
  });
  
  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
};

const processActivityTrends = (data: AnalyticsData[], range: any) => {
  const filtered = data.filter(item => {
    const date = new Date(item.date);
    return date >= range.startDate && date <= range.endDate;
  });
  
  // Group by day
  const dailyCounts: Record<string, number> = {};
  
  filtered.forEach(item => {
    const dateStr = format(new Date(item.date), 'yyyy-MM-dd');
    if (!dailyCounts[dateStr]) {
      dailyCounts[dateStr] = 0;
    }
    dailyCounts[dateStr] += item.count;
  });
  
  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count
  }));
};

export default AnalyticsDashboard;