import React, { useState, useEffect } from 'react';
import { Microscope, CheckCircle, XCircle } from 'lucide-react';
import { UserRole, EventType, QualityTestEvent, Block, CollectionEvent } from '../types';

interface LabFormProps {
  user: { id: string; name: string; role: UserRole };
  chain: Block[];
  onSubmit: (data: QualityTestEvent) => void;
  isLoading: boolean;
}

const LabForm: React.FC<LabFormProps> = ({ user, chain, onSubmit, isLoading }) => {
  // Filter for Collection events
  const collectionBatches = chain
    .filter(b => b.data.resourceType === EventType.COLLECTION)
    .map(b => b.data as CollectionEvent);

  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [moisture, setMoisture] = useState(10.5);
  const [dnaVerified, setDnaVerified] = useState(true);
  const [pesticides, setPesticides] = useState(false);

  // Auto-select the first batch if none is selected
  useEffect(() => {
    if (!selectedBatchId && collectionBatches.length > 0) {
      setSelectedBatchId(collectionBatches[0].id);
    }
  }, [collectionBatches, selectedBatchId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) return;

    const eventData: QualityTestEvent = {
      resourceType: EventType.QUALITY_TEST,
      id: `LAB-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user,
      batchId: selectedBatchId,
      labName: user.name,
      parameters: {
        moistureContent: moisture,
        pesticidesDetected: pesticides,
        heavyMetalsPassed: true,
        dnaVerified: dnaVerified
      },
      result: (moisture <= 12 && dnaVerified && !pesticides) ? 'PASS' : 'FAIL'
    };

    onSubmit(eventData);
  };

  if (collectionBatches.length === 0) {
      return <div className="p-8 text-center text-stone-500">No collections available for testing. Please log in as Farmer and add a harvest.</div>
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-stone-200">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          <Microscope className="h-8 w-8 text-blue-700" />
        </div>
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-800">Quality Control Lab</h2>
          <p className="text-stone-500">Verify purity and compliance of incoming batches.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Select Incoming Batch</label>
          <select 
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="w-full border-stone-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 border"
          >
            {collectionBatches.map(b => (
                <option key={b.id} value={b.id}>
                    {b.species} - {new Date(b.timestamp).toLocaleDateString()} ({b.id})
                </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-stone-700 mb-2">Moisture Content (%)</label>
                <div className="flex items-center space-x-2">
                    <input 
                        type="range" 
                        min="0" max="20" step="0.1"
                        value={moisture}
                        onChange={(e) => setMoisture(Number(e.target.value))}
                        className="w-full accent-blue-600"
                    />
                    <span className={`font-bold ${moisture > 12 ? 'text-red-600' : 'text-green-600'}`}>{moisture}%</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">Must be &le; 12% for acceptance.</p>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-stone-700">DNA Barcoding</label>
                    <button 
                        type="button"
                        onClick={() => setDnaVerified(!dnaVerified)}
                        className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${dnaVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                        {dnaVerified ? <CheckCircle className="w-3 h-3 mr-1"/> : <XCircle className="w-3 h-3 mr-1"/>}
                        {dnaVerified ? 'Verified' : 'Mismatch'}
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-stone-700">Pesticide Screen</label>
                    <button 
                        type="button"
                        onClick={() => setPesticides(!pesticides)}
                        className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${!pesticides ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                        {!pesticides ? 'Clear' : 'Detected'}
                    </button>
                </div>
            </div>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800"
        >
          {isLoading ? 'Processing...' : 'Submit Quality Certificate'}
        </button>
      </form>
    </div>
  );
};

export default LabForm;