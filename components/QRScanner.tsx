import React, { useEffect, useRef, useState } from 'react';
import { XCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    // Access global html5-qrcode library
    const Html5QrcodeScanner = (window as any).Html5QrcodeScanner;

    if (!Html5QrcodeScanner) {
      setScanError("Scanner library not loaded.");
      return;
    }

    const config = { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0 
    };
    
    // Initialize scanner
    scannerRef.current = new Html5QrcodeScanner("reader", config, /* verbose= */ false);
    
    scannerRef.current.render(
        (decodedText: string) => {
            // Success callback
            onScanSuccess(decodedText);
            // Stop scanning automatically after success to prevent multiple triggers
            if(scannerRef.current) {
                scannerRef.current.clear().catch((err: any) => console.error("Failed to clear scanner", err));
            }
        }, 
        (errorMessage: string) => {
            // Ignore scan errors as they happen every frame checking for QR
        }
    );

    // Cleanup function
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error: any) => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg overflow-hidden relative">
            <button 
                onClick={onClose} 
                className="absolute top-2 right-2 z-10 text-stone-500 hover:text-red-500 bg-white rounded-full p-1"
            >
                <XCircle className="w-8 h-8" />
            </button>
            <div className="p-4 bg-emerald-900 text-white text-center">
                <h3 className="font-bold">Scan Product QR</h3>
                <p className="text-xs text-emerald-200">Point camera at the package label</p>
            </div>
            <div id="reader" className="w-full"></div>
            {scanError && <div className="p-4 text-red-600 text-center">{scanError}</div>}
        </div>
    </div>
  );
};

export default QRScanner;