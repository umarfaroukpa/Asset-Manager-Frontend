import React from 'react';
import { Asset } from '../types/Assets';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Eye, Edit, Trash2, QrCode, MapPin, User } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onShowQR?: (id: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  asset, 
  onView, 
  onEdit, 
  onDelete, 
  onShowQR 
}) => {
  const getStatusColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available': return '🟢';
      case 'assigned': return '🔵';
      case 'maintenance': return '🟡';
      case 'retired': return '🔴';
      case 'active': return '🟢';
      case 'inactive': return '⚫';
      default: return '⚪';
    }
  };

  // Helper function to get asset ID (handle both _id and id properties)
  const getAssetId = (asset: Asset): string => {
    return asset._id || (asset as any).id || '';
  };

  // Helper function to get assigned user name
  const getAssignedUserName = (assignedTo: any): string => {
    if (!assignedTo) return '';
    if (typeof assignedTo === 'string') return assignedTo;
    if (typeof assignedTo === 'object') {
      return assignedTo.name || assignedTo.username || assignedTo.email || 'Unknown User';
    }
    return String(assignedTo);
  };

  // Helper function to format creation date
  const getCreatedDate = (asset: Asset): string => {
    const createdAt = (asset as any).createdAt || asset.purchaseDate;
    if (!createdAt) return 'Unknown date';
    return formatDate(createdAt);
  };

  const assetId = getAssetId(asset);
  const assignedUserName = getAssignedUserName(asset.assignedTo);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
            {asset.name}
          </h3>
          {asset.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)} whitespace-nowrap`}>
              {getStatusIcon(asset.status)} {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded inline-block">
          {asset.category}
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {asset.serialNumber && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium min-w-[60px]">Serial:</span>
            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
              {asset.serialNumber}
            </span>
          </div>
        )}
        
        {asset.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span>{asset.location}</span>
          </div>
        )}
        
        {assignedUserName && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-gray-400" />
            <span>Assigned to: <span className="font-medium">{assignedUserName}</span></span>
          </div>
        )}
        
        {asset.purchasePrice && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">Value:</span>
            <span className="ml-2 font-semibold text-green-600">
              {formatCurrency(asset.purchasePrice)}
            </span>
          </div>
        )}

        {asset.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {asset.description}
          </p>
        )}

        {asset.tags && asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {asset.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {asset.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                +{asset.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Created {getCreatedDate(asset)}
          </span>
          <div className="flex space-x-1">
            {onShowQR && assetId && (
              <button
                onClick={() => onShowQR(assetId)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Show QR Code"
              >
                <QrCode className="h-4 w-4" />
              </button>
            )}
            {assetId && (
              <button
                onClick={() => onView(assetId)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {assetId && (
              <button
                onClick={() => onEdit(assetId)}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Edit Asset"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {assetId && (
              <button
                onClick={() => onDelete(assetId)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Delete Asset"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;