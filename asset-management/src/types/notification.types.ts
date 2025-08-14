export interface Notification {
  id: string;
  type: 'maintenance' | 'warranty' | 'assignment' | 'general';
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  assetId?: string;
  read: boolean;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  count: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message: string;
}