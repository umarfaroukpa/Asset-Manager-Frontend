import { Asset } from '../types/Assets';

export const formatAssetStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    available: 'Available',
    assigned: 'Assigned',
    maintenance: 'Maintenance',
    retired: 'Retired',
    active: 'Active',
    inactive: 'Inactive'
  };
  return statusMap[status.toLowerCase()] || status;
};

export const getAssetStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'available': return 'bg-green-100 text-green-800 border-green-200';
    case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'retired': return 'bg-red-100 text-red-800 border-red-200';
    case 'active': return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getAssetId = (asset: Asset): string => {
  return asset._id || (asset as any).id || '';
};

export const getAssignedUserName = (assignedTo: any): string => {
  if (!assignedTo) return 'Unassigned';
  if (typeof assignedTo === 'string') return assignedTo;
  if (typeof assignedTo === 'object') {
    return assignedTo.name || assignedTo.username || assignedTo.email || 'Unknown User';
  }
  return String(assignedTo);
};

export const filterAssets = (
  assets: Asset[],
  searchTerm: string,
  filters: Record<string, string>
): Asset[] => {
  return assets.filter(asset => {
    // Search term matching
    const matchesSearch = searchTerm === '' || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (asset.description && asset.description.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter matching
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'status') return asset.status === value;
      if (key === 'type') return asset.type === value;
      if (key === 'location') return asset.location === value;
      return true;
    });

    return matchesSearch && matchesFilters;
  });
};