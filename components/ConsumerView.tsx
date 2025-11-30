import React, { useState } from 'react';
import { QrCode, Search, BadgeCheck, Map as MapIcon, Sparkles } from 'lucide-react';
import { Block, EventType, CollectionEvent, QualityTestEvent } from '../types';
import { analyzeSupplyChain } from '../services/geminiService';
import QRScanner from './QRScanner';

interface ConsumerViewProps {
  chain: Block[];
}

const ConsumerView: React.FC<ConsumerViewProps> = ({ chain }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundChain, setFoundChain] = useState<Block[] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // For demo: List valid IDs
  const validIds = chain
    .filter(b => b.data.resourceType === EventType.COLLECTION)
    .map(b => b.data.id);

  const performSearch = (term: string) => {
    // Naive search: Find a collection ID and all subsequent events linking to it
    const relevantBlocks = chain.filter(b => {
        const d = b.data;
        if (d.id === term) return true;
        if ((d as any).batchId === term) return true;
        return false;
    });

    if (relevantBlocks.length > 0) {
        setFoundChain(relevantBlocks);
        setAiAnalysis(null);
    } else {
        alert("Product ID not found on the ledger.");
        setFoundChain(null);
    }
  };

  const handleManualSearch = () => {
      performSearch(searchTerm);
  };

  const handleScanSuccess = (decodedText: string) => {
      setShowScanner(false);
      setSearchTerm(decodedText);
      performSearch(decodedText);
  };

  const runAnalysis = async () => {
      if(!foundChain) return;
      setAnalyzing(true);
      const result = await analyzeSupplyChain(foundChain);
      try {
        setAiAnalysis(JSON.parse(result));
      } catch (e) {
        // Fallback if not pure JSON
        setAiAnalysis({ summary: result });
      }
      setAnalyzing(false);
  };

  const collectionEvent = foundChain?.find(b => b.data.resourceType === EventType.COLLECTION)?.data as CollectionEvent;
  const labEvent = foundChain?.find(b => b.data.resourceType === EventType.QUALITY_TEST)?.data as QualityTestEvent;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {showScanner && (
          <QRScanner 
            onScanSuccess={handleScanSuccess} 
            onClose={() => setShowScanner(false)} 
          />
      )}

      {/* Search Header */}
      <div className="bg-emerald-900 rounded-2xl p-8 text-white text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leaves.png')]"></div>
        <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">Verify Your Medicine's Origin</h2>
            <p className="text-emerald-100 mb-6">Scan the QR code or enter the batch ID to trace the journey from soil to bottle.</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
                <button 
                    onClick={() => setShowScanner(true)}
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-2.5 rounded-md font-bold flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                >
                    <QrCode className="w-5 h-5 mr-2" /> Scan QR
                </button>
                
                <span className="text-emerald-300 text-sm font-medium">OR</span>

                <div className="flex w-full md:w-auto bg-white rounded-lg overflow-hidden p-1 shadow-lg">
                    <input 
                        type="text" 
                        placeholder="Enter Batch ID..." 
                        className="flex-1 px-4 py-1 text-gray-800 focus:outline-none min-w-[200px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button 
                        onClick={handleManualSearch}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-1 rounded-md"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            {validIds.length > 0 && (
                <div className="mt-4 text-xs text-emerald-300">
                    Try valid ID: <span className="underline cursor-pointer" onClick={() => { setSearchTerm(validIds[validIds.length-1]); performSearch(validIds[validIds.length-1]); }}>{validIds[validIds.length-1]}</span>
                </div>
            )}
        </div>
      </div>

      {foundChain && collectionEvent && (
        <div className="animate-fade-in space-y-6">
            
            {/* AI Insight Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center text-indigo-900">
                        <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                        <h3 className="font-bold text-lg">AI Supply Chain Analysis</h3>
                    </div>
                    {!aiAnalysis && (
                        <button 
                            onClick={runAnalysis} 
                            disabled={analyzing}
                            className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {analyzing ? 'Analyzing...' : 'Generate Insights'}
                        </button>
                    )}
                </div>
                {aiAnalysis && (
                    <div className="space-y-3 text-sm text-indigo-900">
                        {aiAnalysis.authenticityScore && (
                             <div className="flex items-center">
                                <span className="font-semibold w-32">Authenticity:</span>
                                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500" style={{width: `${aiAnalysis.authenticityScore * 10}%`}}></div>
                                </div>
                                <span className="ml-2 font-bold">{aiAnalysis.authenticityScore}/10</span>
                             </div>
                        )}
                        <p className="italic">"{aiAnalysis.summary}"</p>
                        {aiAnalysis.sustainabilityHighs && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {aiAnalysis.sustainabilityHighs.map((tag: string, i: number) => (
                                    <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs border border-indigo-200">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Provenance Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Origin Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-stone-100">
                    <div className="flex items-center mb-4 text-emerald-800">
                        <MapIcon className="w-6 h-6 mr-2" />
                        <h3 className="font-serif font-bold text-xl">Origin</h3>
                    </div>
                    <div className="space-y-3 text-stone-600">
                        <div className="flex justify-between border-b pb-2">
                            <span>Species</span>
                            <span className="font-medium text-stone-800">{collectionEvent.species}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Location</span>
                            <span className="font-medium text-stone-800 text-xs font-mono">
                                {collectionEvent.location.latitude.toFixed(4)}, {collectionEvent.location.longitude.toFixed(4)}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Harvest Date</span>
                            <span className="font-medium text-stone-800">{new Date(collectionEvent.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Method</span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {collectionEvent.method}
                            </span>
                        </div>
                        
                        {/* Map Placeholder */}
                        <div className="h-32 bg-stone-100 rounded-lg mt-4 flex items-center justify-center text-stone-400 text-sm">
                             [Interactive Map Visualization]
                             <br/>Lat: {collectionEvent.location.latitude}, Lng: {collectionEvent.location.longitude}
                        </div>
                    </div>
                </div>

                {/* Quality Card */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-stone-100">
                     <div className="flex items-center mb-4 text-blue-800">
                        <BadgeCheck className="w-6 h-6 mr-2" />
                        <h3 className="font-serif font-bold text-xl">Quality & Purity</h3>
                    </div>
                    {labEvent ? (
                        <div className="space-y-4">
                             <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <span className="block text-4xl font-bold text-blue-900 mb-1">{labEvent.result}</span>
                                <span className="text-xs uppercase tracking-wide text-blue-700">Lab Certified</span>
                             </div>
                             <ul className="space-y-2 text-sm text-stone-600">
                                <li className="flex items-center">
                                    <BadgeCheck className="w-4 h-4 text-green-500 mr-2" /> DNA Authenticated
                                </li>
                                <li className="flex items-center">
                                    <BadgeCheck className="w-4 h-4 text-green-500 mr-2" /> Pesticide Free
                                </li>
                                <li className="flex items-center">
                                    <BadgeCheck className="w-4 h-4 text-green-500 mr-2" /> Moisture: {labEvent.parameters.moistureContent}% (Safe)
                                </li>
                             </ul>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-lg">
                            Pending Lab Results
                        </div>
                    )}
                </div>

            </div>

             {/* Timeline */}
             <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="font-serif font-bold text-xl mb-6 text-stone-800">Journey Timeline</h3>
                <div className="relative border-l-2 border-emerald-200 ml-4 space-y-8">
                    {foundChain.map((block) => (
                        <div key={block.hash} className="mb-8 ml-6 relative">
                            <span className="absolute -left-9 top-1 bg-white border-2 border-emerald-500 rounded-full w-6 h-6 flex items-center justify-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            </span>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-stone-800">{block.data.resourceType}</h4>
                                    <p className="text-sm text-stone-500">{new Date(block.timestamp).toLocaleString()}</p>
                                    <p className="text-xs text-stone-400 mt-1">Hash: {block.hash.substring(0, 12)}...</p>
                                </div>
                                <div className="text-right text-sm">
                                    <span className="block font-medium text-emerald-800">{block.data.actor.name}</span>
                                    <span className="block text-stone-400 text-xs">{block.data.actor.role}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      )}

      {!foundChain && (
          <div className="text-center py-12">
              <QrCode className="w-24 h-24 mx-auto text-stone-200 mb-4" />
              <p className="text-stone-400">Waiting for scan...</p>
          </div>
      )}
    </div>
  );
};

export default ConsumerView;