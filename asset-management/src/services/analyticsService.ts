import { getFirestore, collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { format, subDays } from 'date-fns';
import { AnalyticsData } from '../utils/analyticsUtils';

export const getAnalyticsData = async () => {
  try {
    // Get date range (last 30 days)
    const startDate = subDays(new Date(), 30);
    
    // 1. Fetch user growth data
    const usersQuery = query(
      collection(db, 'users'),
      where('createdAt', '>=', startDate)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const userData = processUserData(usersSnapshot.docs);
    
    // 2. Fetch asset distribution
    const assetsSnapshot = await getDocs(collection(db, 'assets'));
    const assetData = processAssetData(assetsSnapshot.docs);
    
    // 3. Fetch activity logs
    const activityQuery = query(
      collection(db, 'activityLogs'),
      where('timestamp', '>=', startDate)
    );
    const activitySnapshot = await getDocs(activityQuery);
    const activityData = processActivityData(activitySnapshot.docs);
    
    return {
      userData,
      assetData,
      activityData
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    throw error;
  }
};

// Helper functions to process Firestore documents
const processUserData = (docs: any[]): AnalyticsData[] => {
  const dailyCounts: Record<string, number> = {};
  
  docs.forEach(doc => {
    const userData = doc.data();
    const date = userData.createdAt.toDate();
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

const processAssetData = (docs: any[]): AnalyticsData[] => {
  const categoryCounts: Record<string, number> = {};
  
  docs.forEach(doc => {
    const assetData = doc.data();
    const category = assetData.category || 'Uncategorized';
    
    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }
    categoryCounts[category]++;
  });
  
  return Object.entries(categoryCounts).map(([category, count]) => ({
    date: new Date().toISOString(), // Using current date for consistency
    count,
    category
  }));
};

const processActivityData = (docs: any[]): AnalyticsData[] => {
  const dailyCounts: Record<string, number> = {};
  
  docs.forEach(doc => {
    const activityData = doc.data();
    const date = activityData.timestamp.toDate();
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

// Additional analytics functions
export const getUserCount = async () => {
  const snapshot = await getCountFromServer(collection(db, 'users'));
  return snapshot.data().count;
};

export const getAssetCount = async () => {
  const snapshot = await getCountFromServer(collection(db, 'assets'));
  return snapshot.data().count;
};

export const getRecentActivityCount = async (days: number = 7) => {
  const startDate = subDays(new Date(), days);
  const q = query(
    collection(db, 'activityLogs'),
    where('timestamp', '>=', startDate)
  );
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};