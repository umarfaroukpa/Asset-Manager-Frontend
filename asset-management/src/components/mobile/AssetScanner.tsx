import React, { useState, useEffect } from 'react';
import { QrCode, X, Check, AlertCircle } from 'lucide-react';
import Button from '../common/Button';

interface AssetScannerProps {
  onScanComplete: (assetId: string) => void;
  onClose: () => void;
}

const AssetScanner: React.FC<AssetScannerProps> = ({ onScanComplete, onClose }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock scanner - in a real app you'd use a library like react-qr-reader
  const handleScan = () => {
    setLoading(true);
    setTimeout(() => {
      if (Math.random() > 0.2) { // 80% chance of success
        setScanResult(`ASSET-${Math.floor(Math.random() * 10000)}`);
        setError(null);
      } else {
        setError('Failed to scan QR code. Please try again.');
        setScanResult(null);
      }
      setLoading(false);
    }, 1500);
  };

  const handleConfirm = () => {
    if (scanResult) {
      onScanComplete(scanResult);
      onClose();
    }
  };

  useEffect(() => {
    // In a real app, this would initialize the camera
    setCameraActive(true);
    
    return () => {
      // Clean up camera
      setCameraActive(false);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2"
      >
        <X className="w-6 h-6" />
      </button>
      
      <h2 className="text-xl font-bold text-white mb-6">Scan Asset QR Code</h2>
      
      {/* Scanner View */}
      <div className="relative w-full max-w-md aspect-square mb-6">
        {cameraActive ? (
          <div className="w-full h-full bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
            {loading ? (
              <div className="text-white">Loading scanner...</div>
            ) : (
              <div className="text-center">
                <div className="border-4 border-white border-dashed rounded-lg p-8 mb-4">
                  <QrCode className="w-16 h-16 mx-auto text-white" />
                </div>
                <p className="text-white">Align QR code within frame</p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-white">
            Camera not available
          </div>
        )}
        
        {/* Scanner overlay */}
        <div className="absolute inset-0 border-4 border-green-400 pointer-events-none" style={{
          borderWidth: '40px',
          borderColor: 'rgba(0, 0, 0, 0.5)',
          clipPath: 'polygon(0% 0%, 0% 100%, 20% 100%, 20% 20%, 80% 20%, 80% 80%, 20% 80%, 20% 100%, 100% 100%, 100% 0%)'
        }} />
      </div>
      
      {/* Scan Result or Error */}
      {scanResult && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 w-full max-w-md flex items-start">
          <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Scanned successfully</p>
            <p className="text-sm">Asset ID: {scanResult}</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 w-full max-w-md flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Scan failed</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex space-x-4 w-full max-w-md">
        <Button
          onClick={handleScan}
          variant="primary"
          className="flex-1"
          loading={loading}
        >
          {scanResult ? 'Scan Again' : 'Scan QR Code'}
        </Button>
        
        {scanResult && (
          <Button
            onClick={handleConfirm}
            variant="success"
            className="flex-1"
          >
            <Check className="w-5 h-5 mr-2 inline" />
            Confirm
          </Button>
        )}
      </div>
      
      {/* Offline Notice */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        <p>Works offline - scans will sync when connection is restored</p>
      </div>
    </div>
  );
};

export default AssetScanner;