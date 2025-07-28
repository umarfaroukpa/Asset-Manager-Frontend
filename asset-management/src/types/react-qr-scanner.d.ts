declare module 'react-qr-scanner' {
  import React from 'react';

  interface QrScannerProps {
    delay?: number;
    onError?: (error: Error) => void;
    onScan?: (data: string | null) => void;
    style?: React.CSSProperties;
    className?: string;
    constraints?: MediaTrackConstraints;
    legacyMode?: boolean;
  }

  const QrScanner: React.ForwardRefExoticComponent<
    QrScannerProps & React.RefAttributes<HTMLVideoElement>
  >;

  export default QrScanner;
}