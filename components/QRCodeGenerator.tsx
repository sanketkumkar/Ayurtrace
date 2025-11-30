import React from 'react';
import { Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  data: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ data, size = 200 }) => {
  // Using a reliable public API for generating QR codes to avoid heavy client-side libraries in this POC
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&color=064e3b`;

  const handleDownload = async () => {
    try {
        const response = await fetch(qrUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AyurTrace-Batch-${data}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (e) {
        console.error("Download failed", e);
        alert("Could not download image automatically. Please right click and save.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="bg-white p-4 rounded-lg shadow-inner border border-emerald-100">
        <img src={qrUrl} alt={`QR Code for ${data}`} width={size} height={size} className="mix-blend-multiply" />
      </div>
      <div className="text-center">
          <p className="text-xs font-mono text-stone-500 mb-2">{data}</p>
          <button 
            onClick={handleDownload}
            className="flex items-center justify-center space-x-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1 rounded border border-stone-300 transition-colors"
          >
            <Download className="w-3 h-3" />
            <span>Print Label</span>
          </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;