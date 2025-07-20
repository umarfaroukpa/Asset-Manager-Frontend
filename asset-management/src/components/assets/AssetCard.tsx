
import React from 'react';
import { Asset } from '../../types/Assets';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { Eye, Edit, Trash2, QrCode, MapPin, User, Package, Calendar, DollarSign } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShowQR?: (id: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  asset, 
  onView, 
  onEdit, 
  onDelete, 
  onShowQR,
  variant = 'default',
  className = ''
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

  const getAssetId = (asset: Asset): string => {
    return asset._id || (asset as any).id || '';
  };

  const getAssignedUserName = (assignedTo: any): string => {
    if (!assignedTo) return '';
    if (typeof assignedTo === 'string') return assignedTo;
    if (typeof assignedTo === 'object') {
      return assignedTo.name || assignedTo.username || assignedTo.email || 'Unknown User';
    }
    return String(assignedTo);
  };

  const assetId = getAssetId(asset);
  const assignedUserName = getAssignedUserName(asset.assignedTo);

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                <p className="text-sm text-gray-500">{asset.category}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(asset.status)}`}>
              {asset.status}
            </span>
          </div>

          <div className="space-y-2 mb-2">
            {asset.location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {asset.location}
              </div>
            )}
            {asset.purchaseDate && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(asset.purchaseDate)}
              </div>
            )}
            {asset.purchasePrice && (
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                {formatCurrency(asset.purchasePrice)}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">#{asset.serialNumber}</p>
            <div className="flex space-x-2">
              {onView && (
                <button onClick={() => onView(assetId)} className="p-1 text-gray-400 hover:text-blue-600">
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button onClick={() => onEdit(assetId)} className="p-1 text-gray-400 hover:text-green-600">
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button onClick={() => onDelete(assetId)} className="p-1 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
            {asset.name}
          </h3>
          {asset.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(asset.status)} whitespace-nowrap`}>
              {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
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
            Added {formatDate(asset.createdAt || asset.purchaseDate)}
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
            {onView && assetId && (
              <button
                onClick={() => onView(assetId)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            {onEdit && assetId && (
              <button
                onClick={() => onEdit(assetId)}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Edit Asset"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {onDelete && assetId && (
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