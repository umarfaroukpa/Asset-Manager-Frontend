import { format, subDays } from 'date-fns';

export interface AnalyticsData {
  date: string;
  count: number;
  category?: string;
  type?: string;
}

// Process raw data from API into chart-ready format
export const processAnalyticsData = (rawData: any[], dataType: 'users' | 'assets' | 'activity') => {
  switch (dataType) {
    case 'users':
      return processUserData(rawData);
    case 'assets':
      return processAssetData(rawData);
    case 'activity':
      return processActivityData(rawData);
    default:
      return [];
  }
};

const processUserData = (users: any[]): AnalyticsData[] => {
  const dailyCounts: Record<string, number> = {};
  
  users.forEach(user => {
    const date = new Date(user.createdAt);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!dailyCounts[dateStr]) {
      dailyCounts[dateStr] = 0;
    }
    dailyCounts[dateStr]++;
  });
  
  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count
  }));
};

const processAssetData = (assets: any[]): AnalyticsData[] => {
  const categoryCounts: Record<string, number> = {};
  
  assets.forEach(asset => {
    const category = asset.category || 'Uncategorized';
    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }
    categoryCounts[category]++;
  });
  
  return Object.entries(categoryCounts).map(([category, count]) => ({
    date: new Date().toISOString(), // Dummy date for consistency
    count,
    category
  }));
};

const processActivityData = (activities: any[]): AnalyticsData[] => {
  const dailyCounts: Record<string, number> = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.timestamp);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (!dailyCounts[dateStr]) {
      dailyCounts[dateStr] = 0;
    }
    dailyCounts[dateStr]++;
  });
  
  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count
  }));
};

// Filter data by date range
export const filterByDateRange = (data: AnalyticsData[], startDate: Date, endDate: Date) => {
  return data.filter(item => {
    const date = new Date(item.date);
    return date >= startDate && date <= endDate;
  });
};

// Generate mock data for development
export const generateMockData = (days: number = 30) => {
  const userData: AnalyticsData[] = [];
  const assetData: AnalyticsData[] = [];
  const activityData: AnalyticsData[] = [];
  
  const categories = ['Electronics', 'Furniture', 'Vehicles', 'Equipment', 'Other'];
  
  for (let i = 0; i < days; i++) {
    const date = subDays(new Date(), days - i - 1);
    const dateStr = date.toISOString();
    
    // Users - growing trend
    userData.push({
      date: dateStr,
      count: Math.floor(Math.random() * 10) + 3 * (i / days)
    });
    
    // Activity - random fluctuation
    activityData.push({
      date: dateStr,
      count: Math.floor(Math.random() * 50) + 20
    });
  }
  
  // Assets - by category
  categories.forEach(category => {
    assetData.push({
      date: new Date().toISOString(),
      count: Math.floor(Math.random() * 100) + 20,
      category
    });
  });
  
  return { userData, assetData, activityData };
};