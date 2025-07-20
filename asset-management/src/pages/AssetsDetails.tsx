import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Asset, AuditLog } from '../types/Assets';

const AssetDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAsset();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assets/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Asset not found');
        } else {
          setError('Failed to load asset details');
        }
        return;
      }

      const data = await response.json();
      setAsset(data);
    } catch (error) {
      console.error('Error fetching asset:', error);
      setError('Failed to load asset details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: Asset['status']) => {
    if (!asset || !id) return;

    try {
      const response = await fetch(`/api/assets/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedAsset = await response.json();
      setAsset(updatedAsset);
      alert('Asset status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update asset status');
    }
  };

  const handleDelete = async () => {
    if (!asset || !id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${asset.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }

      alert('Asset deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset');
    }
  };

  const generateQRCode = async () => {
    if (!asset || !id) return;

    try {
      const response = await fetch(`/api/assets/${id}/qr-code`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }

      const updatedAsset = await response.json();
      setAsset(updatedAsset);
      setShowQRCode(true);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    }
  };

  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Asset Not Found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
              <p className="mt-2 text-gray-600">{asset.description || 'No description available'}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/edit/${asset._id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Edit Asset
              </Link>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Asset Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                    <select
                      value={asset.status}
                      onChange={(e) => handleStatusChange(e.target.value as Asset['status'])}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="available">Available</option>
                      <option value="assigned">Assigned</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Serial Number</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.serialNumber || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.location || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Purchase Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(asset.purchaseDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Purchase Price</label>
                  <p className="mt-1 text-sm text-gray-900">{formatCurrency(asset.purchasePrice)}</p>
                </div>
              </div>

              {/* Tags */}
              {asset.tags && asset.tags.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assigned User */}
              {asset.assignedTo && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500">Assigned To</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.assignedTo.username}</p>
                </div>
              )}
            </div>

            {/* Audit History */}
            {asset.history && asset.history.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity History</h2>
                <div className="space-y-4">
                  {asset.history.slice(0, 10).map((log) => (
                    <div key={log._id} className="border-l-4 border-blue-200 pl-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.action}</p>
                          {log.details && (
                            <p className="text-sm text-gray-600 mt-1">
                              {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code</h3>
              {asset.qrCode ? (
                <div className="text-center">
                  <img
                    src={asset.qrCode}
                    alt="Asset QR Code"
                    className="mx-auto mb-4 w-32 h-32"
                  />
                  <button
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {showQRCode ? 'Hide' : 'Show'} QR Code
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 mb-4">No QR code generated</p>
                  <button
                    onClick={generateQRCode}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    Generate QR Code
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm"
                >
                  Print Details
                </button>
                <button
                  onClick={() => {
                    const data = {
                      name: asset.name,
                      category: asset.category,
                      serialNumber: asset.serialNumber,
                      status: asset.status
                    };
                    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                    alert('Asset data copied to clipboard!');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm"
                >
                  Copy Asset Data
                </button>
                <Link
                  to={`/edit/${asset._id}`}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm text-center block"
                >
                  Edit Asset
                </Link>
              </div>
            </div>

            {/* Asset Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Created</span>
                  <span className="text-sm text-gray-900">
                    {formatDate(asset.purchaseDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status Changes</span>
                  <span className="text-sm text-gray-900">
                    {asset.history?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Current Value</span>
                  <span className="text-sm text-gray-900">
                    {formatCurrency(asset.purchasePrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetails;