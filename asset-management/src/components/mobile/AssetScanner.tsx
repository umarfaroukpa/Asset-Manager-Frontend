import React, { useState, useEffect, useRef } from 'react';
import { QrCode, X, Check, AlertCircle, CameraOff } from 'lucide-react';
import Button from '../common/Button';
import QrScanner from 'react-qr-scanner';

interface AssetScannerProps {
  onScanComplete: (assetId: string) => void;
  onClose: () => void;
}

const AssetScanner: React.FC<AssetScannerProps> = ({ onScanComplete, onClose }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<any>(null);

  // Handle QR code scan
  const handleScan = (data: string | null) => {
    if (data) {
      setLoading(true);
      try {
        // Validate the scanned data 
        if (data.length > 0) {
          setScanResult(data);
          setError(null);
        } else {
          setError('Invalid QR code format');
        }
      } catch (err) {
        setError('Failed to process QR code');
        console.error('Scan error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err: Error) => {
    console.error('Scanner error:', err);
    setError(err.message || 'Failed to access camera');
    setCameraActive(false);
  };

  const handleConfirm = () => {
    if (scanResult) {
      onScanComplete(scanResult);
      onClose();
    }
  };

  const startScanner = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check camera permissions
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      
      setCameraActive(true);
    } catch (err) {
      setHasPermission(false);
      setError('Camera access denied. Please enable camera permissions.');
    } finally {
      setLoading(false);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startScanner();
    
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2"
        aria-label="Close scanner"
      >
        <X className="w-6 h-6" />
      </button>
      
      <h2 className="text-xl font-bold text-white mb-6">Scan Asset QR Code</h2>
      
      {/* Scanner View */}
      <div className="relative w-full max-w-md aspect-square mb-6">
        {hasPermission === false ? (
          <div className="w-full h-full bg-gray-800 rounded-lg flex flex-col items-center justify-center text-white p-4">
            <CameraOff className="w-16 h-16 mb-4 text-red-400" />
            <p className="text-center">Camera access denied. Please check your browser permissions.</p>
          </div>
        ) : cameraActive ? (
          <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
            <QrScanner
              ref={scannerRef}
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              constraints={{
                facingMode: 'environment', // Prefer rear camera
              }}
            />
            {/* Scanner overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="border-2 border-white border-dashed rounded-lg w-64 h-64 relative">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-l-2 border-t-2 border-white" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-r-2 border-t-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-2 border-b-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-2 border-b-2 border-white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-white">
            {loading ? 'Initializing scanner...' : 'Camera not active'}
          </div>
        )}
      </div>
      
      {/* Scan Result or Error */}
      {scanResult && (
        <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 w-full max-w-md flex items-start">
          <Check className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Scanned successfully</p>
            <p className="text-sm break-all">Asset ID: {scanResult}</p>
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
        {!scanResult && (
          <Button
            onClick={startScanner}
            variant="primary"
            className="flex-1"
            loading={loading}
            disabled={hasPermission === false}
          >
            {cameraActive ? 'Scanning...' : 'Start Scanner'}
          </Button>
        )}
        
        {scanResult && (
          <>
            <Button
              onClick={() => {
                setScanResult(null);
                startScanner();
              }}
              variant="secondary"
              className="flex-1"
            >
              Scan Again
            </Button>
            <Button
              onClick={handleConfirm}
              variant="success"
              className="flex-1"
            >
              <Check className="w-5 h-5 mr-2 inline" />
              Confirm
            </Button>
          </>
        )}
      </div>
      
      {/* Help Text */}
      <div className="mt-6 text-center text-gray-400 text-sm max-w-md">
        <p>Point your camera at the asset QR code. Scanning happens automatically.</p>
        {hasPermission === false && (
          <p className="text-red-300 mt-2">
            You need to enable camera permissions in your browser settings.
          </p>
        )}
      </div>
    </div>
  );
};

export default AssetScanner;