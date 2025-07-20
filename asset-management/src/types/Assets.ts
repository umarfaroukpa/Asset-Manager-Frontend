assets.ts// src/types/assets.ts
export interface Asset {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  category: string;
  type: 'physical' | 'digital' | 'vehicle' | 'equipment';
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  location?: string;
  assignedTo?: any; // Can be string or User object
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