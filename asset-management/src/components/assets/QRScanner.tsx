import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { X, Camera, AlertCircle, RefreshCw } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRScannerComponent: React.FC<QRScannerProps> = ({
  onScan,
  onClose,
  isOpen
}) => {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  const handleScan = (detectedCodes: any[]) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const result = detectedCodes[0].rawValue;
      setScanning(false);
      onScan(result);
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner error:', error);
    setError('Camera access denied or not available. Please allow camera access and try again.');
  };

  const handleRetry = () => {
    setError(null);
    setScanning(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Scan QR Code
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {error ? (
            <div className="text-center space-y-4">
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
              <button
                onClick={handleRetry}
                className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="rounded-lg overflow-hidden bg-gray-100" style={{ height: '300px' }}>
                <Scanner
                  onScan={handleScan}
                  onError={handleError}
                  constraints={{
                    facingMode: 'environment', // Use back camera
                  }}
                />
              </div>
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border-2 border-white border-dashed rounded-lg w-48 h-48 flex items-center justify-center">
                    <span className="text-white text-sm text-center px-2">
                      Position QR code here
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Point your camera at a QR code to scan it
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScannerComponent;