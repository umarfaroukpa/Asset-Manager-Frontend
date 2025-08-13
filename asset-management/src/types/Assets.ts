export interface Asset {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  category: string;
  type?: 'physical' | 'digital' | 'vehicle' | 'equipment';
  status: 'available' | 'assigned' | 'maintenance' | 'retired' | 'active';
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  value?: number;
  location?: string;
  assignedTo?: {
    id: string;
    name: string;
    email?: string;
    username?: string;
  };
  tags?: string[];
  qrCode?: string;
  createdAt?: string;
  updatedAt?: string;
  history?: AuditLog[];
  // Digital asset specific
  licenseKey?: string;
  subscriptionEnd?: string;
  platform?: string;
  // Vehicle specific
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  licensePlate?: string;
  currentMileage?: number;
}

export interface AssetFormData {
  name: string;
  description?: string;
  category: string;
  type?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  location?: string;
  assignedTo?: string;
  tags?: string[];
  // Digital asset specific
  licenseKey?: string;
  subscriptionEnd?: string;
  platform?: string;
  // Vehicle specific
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  licensePlate?: string;
  currentMileage?: number;
}

export interface AuditLog {
  _id: string;
  action: string;
  details: string | Record<string, any>;
  timestamp: string;
  user: {
    _id: string;
    name: string;
  };
}